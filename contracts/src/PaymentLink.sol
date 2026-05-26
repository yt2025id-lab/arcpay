// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Errors, LinkStatus, PaymentConfig, PaymentLinkData} from "./libraries/ArcPayLib.sol";
import {IFeeManager} from "./interfaces/IFeeManager.sol";

contract PaymentLink is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable USDC;
    IFeeManager public feeManager;
    uint256 public linkCount;

    mapping(bytes32 => PaymentLinkData) public links;
    mapping(address => bytes32[]) public merchantLinks;

    event LinkCreated(bytes32 indexed linkId, address indexed merchant, uint256 amount, uint64 expiresAt);
    event LinkPaid(bytes32 indexed linkId, address indexed payer, uint256 amount);
    event LinkRefunded(bytes32 indexed linkId, address indexed payer, uint256 amount);
    event LinkCancelled(bytes32 indexed linkId);

    constructor(address _usdc, address _owner) Ownable(_owner) {
        if (_usdc == address(0)) revert Errors.ZeroAddress();
        USDC = IERC20(_usdc);
    }

    function setFeeManager(address _feeManager) external onlyOwner {
        if (_feeManager == address(0)) revert Errors.ZeroAddress();
        feeManager = IFeeManager(_feeManager);
    }

    function createLink(PaymentConfig calldata config) external returns (bytes32) {
        if (config.merchant == address(0)) revert Errors.ZeroAddress();
        if (config.splitAddrs.length != config.splitBps.length) revert Errors.SplitMismatch();
        if (config.splitBps.length > 0) {
            uint16 total;
            for (uint256 i = 0; i < config.splitBps.length; i++) {
                if (config.splitAddrs[i] == address(0)) revert Errors.ZeroAddress();
                total += config.splitBps[i];
            }
            if (total != 10000) revert Errors.InvalidBps();
        }

        linkCount++;
        bytes32 linkId = keccak256(
            abi.encodePacked(config.merchant, block.timestamp, linkCount)
        );

        PaymentLinkData storage link = links[linkId];
        link.id = linkId;
        link.merchant = config.merchant;
        link.amount = config.amount;
        link.paidAmount = 0;
        link.payer = address(0);
        link.createdAt = uint64(block.timestamp);
        link.expiresAt = config.expiresAt;
        link.allowPartial = config.allowPartial;
        link.privacyHash = config.privacyHash;
        link.status = LinkStatus.Active;
        link.splitAddrs = config.splitAddrs;
        link.splitBps = config.splitBps;

        merchantLinks[config.merchant].push(linkId);

        emit LinkCreated(linkId, config.merchant, config.amount, config.expiresAt);
        return linkId;
    }

    function pay(bytes32 linkId, uint256 amount) external nonReentrant {
        PaymentLinkData storage link = links[linkId];

        if (link.status != LinkStatus.Active) revert Errors.LinkNotActive();
        if (link.expiresAt > 0 && block.timestamp > link.expiresAt) revert Errors.LinkExpired();
        if (amount == 0) revert Errors.ZeroAmount();

        if (link.amount > 0) {
            if (!link.allowPartial && amount < link.amount) revert Errors.PartialNotAllowed();
            if (link.paidAmount + amount > link.amount) revert Errors.InsufficientPayment();
        }

        uint256 feeBps = _getFeeBps();
        uint256 fee = (amount * feeBps) / 10000;
        uint256 netAmount = amount - fee;

        USDC.safeTransferFrom(msg.sender, address(this), amount);

        if (fee > 0 && address(feeManager) != address(0)) {
            USDC.safeTransfer(address(feeManager), fee);
        }

        if (link.splitAddrs.length > 0) {
            _distributeSplit(netAmount, link.splitAddrs, link.splitBps);
        } else {
            USDC.safeTransfer(link.merchant, netAmount);
        }

        link.paidAmount += amount;
        link.payer = msg.sender;

        if (link.amount == 0 || link.paidAmount >= link.amount) {
            link.status = LinkStatus.Paid;
        }

        emit LinkPaid(linkId, msg.sender, amount);
    }

    function refund(bytes32 linkId) external nonReentrant {
        PaymentLinkData storage link = links[linkId];

        if (link.status != LinkStatus.Paid) revert Errors.InvalidState();
        if (msg.sender != link.merchant) revert Errors.NotMerchant();

        uint256 refundAmount = link.paidAmount;
        address payer = link.payer;
        link.status = LinkStatus.Refunded;

        USDC.safeTransfer(payer, refundAmount);

        emit LinkRefunded(linkId, payer, refundAmount);
    }

    function cancelLink(bytes32 linkId) external {
        PaymentLinkData storage link = links[linkId];
        if (link.status != LinkStatus.Active) revert Errors.InvalidState();
        if (msg.sender != link.merchant) revert Errors.NotMerchant();

        link.status = LinkStatus.Cancelled;
        emit LinkCancelled(linkId);
    }

    function getStatus(bytes32 linkId) external view returns (LinkStatus) {
        PaymentLinkData storage link = links[linkId];
        if (
            link.status == LinkStatus.Active &&
            link.expiresAt > 0 &&
            block.timestamp > link.expiresAt
        ) {
            return LinkStatus.Expired;
        }
        return link.status;
    }

    function getMerchantLinks(address merchant) external view returns (bytes32[] memory) {
        return merchantLinks[merchant];
    }

    function _distributeSplit(
        uint256 amount,
        address[] storage addrs,
        uint16[] storage bps
    ) internal {
        for (uint256 i = 0; i < addrs.length; i++) {
            uint256 share = (amount * bps[i]) / 10000;
            if (share > 0) {
                USDC.safeTransfer(addrs[i], share);
            }
        }
    }

    function _getFeeBps() internal view returns (uint256) {
        if (address(feeManager) == address(0)) return 0;
        try feeManager.feeBps() returns (uint256 bps) {
            return bps;
        } catch {
            return 10;
        }
    }
}

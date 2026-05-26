// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Errors} from "./libraries/ArcPayLib.sol";

struct SplitConfig {
    address owner;
    address[] recipients;
    uint16[] bps;
    bool immutable_;
    uint256 totalReceived;
}

contract SplitRouter is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable USDC;
    uint256 public splitCount;

    mapping(uint256 => SplitConfig) public splits;
    mapping(address => uint256[]) public userSplits;

    event SplitCreated(uint256 indexed splitId, address indexed owner, address[] recipients, uint16[] bps, bool immutable_);
    event SplitDistributed(uint256 indexed splitId, address indexed recipient, uint256 amount);
    event SplitUpdated(uint256 indexed splitId, address[] recipients, uint16[] bps);

    constructor(address _usdc, address _owner) Ownable(_owner) {
        if (_usdc == address(0)) revert Errors.ZeroAddress();
        USDC = IERC20(_usdc);
    }

    function createSplit(
        address[] calldata recipients,
        uint16[] calldata bps,
        bool immutable_
    ) external returns (uint256) {
        if (recipients.length != bps.length) revert Errors.SplitMismatch();
        if (recipients.length == 0) revert Errors.InvalidState();

        uint16 total;
        for (uint256 i = 0; i < bps.length; i++) {
            if (recipients[i] == address(0)) revert Errors.ZeroAddress();
            total += bps[i];
        }
        if (total != 10000) revert Errors.InvalidBps();

        splitCount++;
        uint256 splitId = splitCount;

        SplitConfig storage config = splits[splitId];
        config.owner = msg.sender;
        config.recipients = recipients;
        config.bps = bps;
        config.immutable_ = immutable_;
        config.totalReceived = 0;

        userSplits[msg.sender].push(splitId);

        emit SplitCreated(splitId, msg.sender, recipients, bps, immutable_);
        return splitId;
    }

    function routePayment(uint256 splitId, uint256 amount) external nonReentrant {
        SplitConfig storage config = splits[splitId];
        if (config.recipients.length == 0) revert Errors.InvalidState();
        if (amount == 0) revert Errors.ZeroAmount();

        USDC.safeTransferFrom(msg.sender, address(this), amount);
        config.totalReceived += amount;

        for (uint256 i = 0; i < config.recipients.length; i++) {
            uint256 share = (amount * config.bps[i]) / 10000;
            if (share > 0) {
                USDC.safeTransfer(config.recipients[i], share);
                emit SplitDistributed(splitId, config.recipients[i], share);
            }
        }
    }

    function updateSplit(
        uint256 splitId,
        address[] calldata recipients,
        uint16[] calldata bps
    ) external {
        SplitConfig storage config = splits[splitId];
        if (config.recipients.length == 0) revert Errors.InvalidState();
        if (config.immutable_) revert Errors.InvalidState();
        if (msg.sender != config.owner) revert Errors.NotAuthorized();
        if (recipients.length != bps.length) revert Errors.SplitMismatch();

        uint16 total;
        for (uint256 i = 0; i < bps.length; i++) {
            if (recipients[i] == address(0)) revert Errors.ZeroAddress();
            total += bps[i];
        }
        if (total != 10000) revert Errors.InvalidBps();

        config.recipients = recipients;
        config.bps = bps;

        emit SplitUpdated(splitId, recipients, bps);
    }

    function getSplitRecipients(uint256 splitId) external view returns (address[] memory) {
        return splits[splitId].recipients;
    }

    function getSplitBps(uint256 splitId) external view returns (uint16[] memory) {
        return splits[splitId].bps;
    }

    function getUserSplits(address user) external view returns (uint256[] memory) {
        return userSplits[user];
    }
}

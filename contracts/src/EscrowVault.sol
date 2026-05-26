// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "openzeppelin-contracts/contracts/utils/Pausable.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Errors} from "./libraries/ArcPayLib.sol";

enum EscrowStatus {
    Created,
    Funded,
    Released,
    Refunded,
    Disputed
}

struct EscrowData {
    bytes32 id;
    address buyer;
    address seller;
    uint256 amount;
    uint64 createdAt;
    uint64 releaseAt;
    EscrowStatus status;
    address arbiter;
}

contract EscrowVault is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public immutable USDC;
    uint256 public escrowCount;

    mapping(bytes32 => EscrowData) public escrows;
    mapping(address => bytes32[]) public userEscrows;

    event EscrowCreated(bytes32 indexed id, address indexed buyer, address indexed seller, uint256 amount, uint64 releaseAt);
    event EscrowFunded(bytes32 indexed id, uint256 amount);
    event EscrowReleased(bytes32 indexed id, address to, uint256 amount);
    event EscrowRefunded(bytes32 indexed id, address to, uint256 amount);
    event EscrowDisputed(bytes32 indexed id, address by);

    constructor(address _usdc, address _owner) Ownable(_owner) {
        if (_usdc == address(0)) revert Errors.ZeroAddress();
        USDC = IERC20(_usdc);
    }

    function createEscrow(
        address seller,
        uint256 amount,
        uint64 releaseAt,
        address arbiter
    ) external returns (bytes32) {
        if (seller == address(0)) revert Errors.ZeroAddress();
        if (amount == 0) revert Errors.ZeroAmount();

        escrowCount++;
        bytes32 escrowId = keccak256(
            abi.encodePacked(msg.sender, seller, block.timestamp, escrowCount)
        );

        EscrowData storage escrow = escrows[escrowId];
        escrow.id = escrowId;
        escrow.buyer = msg.sender;
        escrow.seller = seller;
        escrow.amount = amount;
        escrow.createdAt = uint64(block.timestamp);
        escrow.releaseAt = releaseAt;
        escrow.status = EscrowStatus.Created;
        escrow.arbiter = arbiter;

        userEscrows[msg.sender].push(escrowId);
        userEscrows[seller].push(escrowId);

        emit EscrowCreated(escrowId, msg.sender, seller, amount, releaseAt);
        return escrowId;
    }

    function fundEscrow(bytes32 escrowId) external nonReentrant whenNotPaused {
        EscrowData storage escrow = escrows[escrowId];
        if (escrow.status != EscrowStatus.Created) revert Errors.InvalidState();

        USDC.safeTransferFrom(msg.sender, address(this), escrow.amount);
        escrow.status = EscrowStatus.Funded;

        emit EscrowFunded(escrowId, escrow.amount);
    }

    function release(bytes32 escrowId) external nonReentrant whenNotPaused {
        EscrowData storage escrow = escrows[escrowId];
        if (escrow.status != EscrowStatus.Funded) revert Errors.InvalidState();
        if (msg.sender != escrow.buyer && msg.sender != escrow.arbiter) revert Errors.NotAuthorized();

        uint256 amount = escrow.amount;
        escrow.status = EscrowStatus.Released;

        USDC.safeTransfer(escrow.seller, amount);

        emit EscrowReleased(escrowId, escrow.seller, amount);
    }

    function refund(bytes32 escrowId) external nonReentrant whenNotPaused {
        EscrowData storage escrow = escrows[escrowId];
        if (escrow.status != EscrowStatus.Funded) revert Errors.InvalidState();

        if (escrow.releaseAt > 0 && block.timestamp < escrow.releaseAt) {
            if (msg.sender != escrow.buyer && msg.sender != escrow.arbiter) revert Errors.EscrowNotExpired();
        } else {
            if (msg.sender != escrow.seller && msg.sender != escrow.arbiter && msg.sender != escrow.buyer) revert Errors.NotAuthorized();
        }

        uint256 amount = escrow.amount;
        escrow.status = EscrowStatus.Refunded;

        USDC.safeTransfer(escrow.buyer, amount);

        emit EscrowRefunded(escrowId, escrow.buyer, amount);
    }

    function dispute(bytes32 escrowId) external {
        EscrowData storage escrow = escrows[escrowId];
        if (escrow.status != EscrowStatus.Funded) revert Errors.InvalidState();
        if (msg.sender != escrow.buyer && msg.sender != escrow.seller) revert Errors.NotAuthorized();

        escrow.status = EscrowStatus.Disputed;
        emit EscrowDisputed(escrowId, msg.sender);
    }

    function getUserEscrows(address user) external view returns (bytes32[] memory) {
        return userEscrows[user];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}

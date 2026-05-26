// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Errors} from "./libraries/ArcPayLib.sol";
import {IFeeManager} from "./interfaces/IFeeManager.sol";

enum InvoiceStatus {
    Draft,
    Issued,
    Paid,
    PartiallyPaid,
    Overdue,
    Cancelled,
    Disputed
}

struct InvoiceItem {
    string description;
    uint256 unitPrice;
    uint16 quantity;
    uint16 taxBps;
}

struct InvoiceData {
    bytes32 id;
    address issuer;
    address recipient;
    uint256 totalAmount;
    uint256 paidAmount;
    uint64 issuedAt;
    uint64 dueDate;
    uint16 latePenaltyBps;
    InvoiceStatus status;
    bytes32 privacyHash;
    uint256 itemCount;
}

contract Invoice is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable USDC;
    IFeeManager public feeManager;
    uint256 public invoiceCount;

    mapping(bytes32 => InvoiceData) public invoices;
    mapping(bytes32 => InvoiceItem[]) public invoiceItems;
    mapping(address => bytes32[]) public issuerInvoices;
    mapping(address => bytes32[]) public recipientInvoices;

    event InvoiceIssued(bytes32 indexed invoiceId, address indexed issuer, address indexed recipient, uint256 totalAmount, uint64 dueDate);
    event InvoicePaid(bytes32 indexed invoiceId, address payer, uint256 amount);
    event InvoiceCancelled(bytes32 indexed invoiceId);
    event InvoiceDisputed(bytes32 indexed invoiceId, address by);

    constructor(address _usdc, address _owner) Ownable(_owner) {
        if (_usdc == address(0)) revert Errors.ZeroAddress();
        USDC = IERC20(_usdc);
    }

    function setFeeManager(address _feeManager) external onlyOwner {
        if (_feeManager == address(0)) revert Errors.ZeroAddress();
        feeManager = IFeeManager(_feeManager);
    }

    function issueInvoice(
        address recipient,
        InvoiceItem[] calldata items,
        uint64 dueDate,
        uint16 latePenaltyBps,
        bytes32 privacyHash
    ) external returns (bytes32) {
        if (recipient == address(0)) revert Errors.ZeroAddress();
        if (items.length == 0) revert Errors.InvalidState();
        if (dueDate > 0 && latePenaltyBps > 500) revert Errors.InvalidBps();
        if (latePenaltyBps > 0 && dueDate == 0) revert Errors.InvalidBps();

        invoiceCount++;
        bytes32 invoiceId = keccak256(
            abi.encodePacked(msg.sender, recipient, block.timestamp, invoiceCount)
        );

        uint256 total;
        for (uint256 i = 0; i < items.length; i++) {
            uint256 itemTotal = uint256(items[i].unitPrice) * uint256(items[i].quantity);
            uint256 tax = (itemTotal * uint256(items[i].taxBps)) / 10000;
            total += itemTotal + tax;
            invoiceItems[invoiceId].push(items[i]);
        }

        InvoiceData storage inv = invoices[invoiceId];
        inv.id = invoiceId;
        inv.issuer = msg.sender;
        inv.recipient = recipient;
        inv.totalAmount = total;
        inv.paidAmount = 0;
        inv.issuedAt = uint64(block.timestamp);
        inv.dueDate = dueDate;
        inv.latePenaltyBps = latePenaltyBps;
        inv.status = InvoiceStatus.Issued;
        inv.privacyHash = privacyHash;
        inv.itemCount = items.length;

        issuerInvoices[msg.sender].push(invoiceId);
        recipientInvoices[recipient].push(invoiceId);

        emit InvoiceIssued(invoiceId, msg.sender, recipient, total, dueDate);
        return invoiceId;
    }

    function payInvoice(bytes32 invoiceId, uint256 amount) external nonReentrant {
        InvoiceData storage inv = invoices[invoiceId];

        if (inv.status != InvoiceStatus.Issued && inv.status != InvoiceStatus.PartiallyPaid && inv.status != InvoiceStatus.Overdue)
            revert Errors.InvalidState();
        if (amount == 0) revert Errors.ZeroAmount();

        uint256 amountDue = _calculateAmountDue(inv);
        if (amount > amountDue - inv.paidAmount) {
            amount = amountDue - inv.paidAmount;
        }

        uint256 feeBps = _getFeeBps();
        uint256 fee = (amount * feeBps) / 10000;
        uint256 netAmount = amount - fee;

        USDC.safeTransferFrom(msg.sender, address(this), amount);

        if (fee > 0 && address(feeManager) != address(0)) {
            USDC.safeTransfer(address(feeManager), fee);
        }

        USDC.safeTransfer(inv.issuer, netAmount);

        inv.paidAmount += amount;

        if (inv.paidAmount >= amountDue) {
            inv.status = InvoiceStatus.Paid;
        } else {
            inv.status = InvoiceStatus.PartiallyPaid;
        }

        emit InvoicePaid(invoiceId, msg.sender, amount);
    }

    function cancelInvoice(bytes32 invoiceId) external {
        InvoiceData storage inv = invoices[invoiceId];
        if (inv.status != InvoiceStatus.Issued) revert Errors.InvalidState();
        if (msg.sender != inv.issuer) revert Errors.NotMerchant();

        inv.status = InvoiceStatus.Cancelled;
        emit InvoiceCancelled(invoiceId);
    }

    function disputeInvoice(bytes32 invoiceId) external {
        InvoiceData storage inv = invoices[invoiceId];
        if (inv.status != InvoiceStatus.Issued && inv.status != InvoiceStatus.PartiallyPaid)
            revert Errors.InvalidState();
        if (msg.sender != inv.recipient) revert Errors.NotPayer();

        inv.status = InvoiceStatus.Disputed;
        emit InvoiceDisputed(invoiceId, msg.sender);
    }

    function getInvoiceItems(bytes32 invoiceId) external view returns (InvoiceItem[] memory) {
        return invoiceItems[invoiceId];
    }

    function getIssuerInvoices(address issuer) external view returns (bytes32[] memory) {
        return issuerInvoices[issuer];
    }

    function getRecipientInvoices(address recipient) external view returns (bytes32[] memory) {
        return recipientInvoices[recipient];
    }

    function _calculateAmountDue(InvoiceData storage inv) internal view returns (uint256) {
        if (inv.dueDate > 0 && block.timestamp > inv.dueDate && inv.latePenaltyBps > 0) {
            uint256 daysLate = (block.timestamp - inv.dueDate) / 86400;
            uint256 penalty = (inv.totalAmount * uint256(inv.latePenaltyBps) * daysLate) / 10000;
            return inv.totalAmount + penalty;
        }
        return inv.totalAmount;
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

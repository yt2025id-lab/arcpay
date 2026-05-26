// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Errors {
    error ZeroAddress();
    error ZeroAmount();
    error InvalidBps();
    error LinkExpired();
    error LinkNotActive();
    error LinkAlreadyPaid();
    error PartialNotAllowed();
    error InsufficientPayment();
    error AlreadyRefunded();
    error NotMerchant();
    error NotPayer();
    error SplitMismatch();
    error InvalidState();
    error NotAuthorized();
    error EscrowNotExpired();
}

enum LinkStatus {
    Active,
    Paid,
    Expired,
    Refunded,
    Cancelled
}

struct PaymentConfig {
    address merchant;
    uint256 amount;
    uint64 expiresAt;
    bool allowPartial;
    bytes32 privacyHash;
    address[] splitAddrs;
    uint16[] splitBps;
}

struct PaymentLinkData {
    bytes32 id;
    address merchant;
    uint256 amount;
    uint256 paidAmount;
    address payer;
    uint64 createdAt;
    uint64 expiresAt;
    bool allowPartial;
    bytes32 privacyHash;
    LinkStatus status;
    address[] splitAddrs;
    uint16[] splitBps;
}

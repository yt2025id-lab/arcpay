// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {Errors} from "./libraries/ArcPayLib.sol";

struct PrivacyConfig {
    bytes32 commitment;
    address recipient;
    bool isActive;
}

contract PrivacyShield is Ownable {
    mapping(bytes32 => PrivacyConfig) public shields;

    event PrivacyEnabled(bytes32 indexed shieldId, address indexed recipient);
    event PrivacyClaimed(bytes32 indexed shieldId, address indexed claimant);
    event PrivacyRevoked(bytes32 indexed shieldId);

    constructor(address _owner) Ownable(_owner) {}

    function enablePrivacy(bytes32 shieldId, bytes32 commitment, address recipient) external {
        if (recipient == address(0)) revert Errors.ZeroAddress();
        if (commitment == bytes32(0)) revert Errors.InvalidState();

        shields[shieldId] = PrivacyConfig({
            commitment: commitment,
            recipient: recipient,
            isActive: true
        });

        emit PrivacyEnabled(shieldId, recipient);
    }

    function claimPrivacy(bytes32 shieldId, bytes32 secret) external returns (address) {
        PrivacyConfig storage shield = shields[shieldId];
        if (!shield.isActive) revert Errors.InvalidState();
        if (keccak256(abi.encodePacked(secret)) != shield.commitment) revert Errors.InvalidState();

        address recipient = shield.recipient;
        shield.isActive = false;

        emit PrivacyClaimed(shieldId, recipient);
        return recipient;
    }

    function revokePrivacy(bytes32 shieldId) external {
        PrivacyConfig storage shield = shields[shieldId];
        if (!shield.isActive) revert Errors.InvalidState();
        if (msg.sender != shield.recipient) revert Errors.NotAuthorized();

        shield.isActive = false;
        emit PrivacyRevoked(shieldId);
    }

    function isShieldActive(bytes32 shieldId) external view returns (bool) {
        return shields[shieldId].isActive;
    }
}

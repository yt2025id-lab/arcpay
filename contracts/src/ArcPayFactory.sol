// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {PaymentLink} from "./PaymentLink.sol";
import {Invoice} from "./Invoice.sol";
import {SplitRouter} from "./SplitRouter.sol";
import {EscrowVault} from "./EscrowVault.sol";
import {FeeManager} from "./FeeManager.sol";
import {PrivacyShield} from "./PrivacyShield.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {Errors} from "./libraries/ArcPayLib.sol";

contract ArcPayFactory is Ownable {
    address public usdc;
    address public treasury;
    PaymentLink public paymentLink;
    Invoice public invoice;
    SplitRouter public splitRouter;
    EscrowVault public escrowVault;
    FeeManager public feeManager;
    PrivacyShield public privacyShield;

    event ProtocolDeployed(
        address paymentLink,
        address invoice,
        address splitRouter,
        address escrowVault,
        address feeManager,
        address privacyShield
    );

    constructor(address _usdc, address _treasury, address _owner) Ownable(_owner) {
        if (_usdc == address(0)) revert Errors.ZeroAddress();
        if (_treasury == address(0)) revert Errors.ZeroAddress();
        usdc = _usdc;
        treasury = _treasury;

        feeManager = new FeeManager(_usdc, _treasury, _owner);
        paymentLink = new PaymentLink(_usdc, _owner);
        invoice = new Invoice(_usdc, _owner);
        splitRouter = new SplitRouter(_usdc, _owner);
        escrowVault = new EscrowVault(_usdc, _owner);
        privacyShield = new PrivacyShield(_owner);

        paymentLink.setFeeManager(address(feeManager));
        invoice.setFeeManager(address(feeManager));

        emit ProtocolDeployed(
            address(paymentLink),
            address(invoice),
            address(splitRouter),
            address(escrowVault),
            address(feeManager),
            address(privacyShield)
        );
    }

    function getProtocolAddresses() external view returns (
        address _paymentLink,
        address _invoice,
        address _splitRouter,
        address _escrowVault,
        address _feeManager,
        address _privacyShield
    ) {
        return (
            address(paymentLink),
            address(invoice),
            address(splitRouter),
            address(escrowVault),
            address(feeManager),
            address(privacyShield)
        );
    }
}

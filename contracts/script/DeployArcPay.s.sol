// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {ArcPayFactory} from "../src/ArcPayFactory.sol";

contract DeployArcPay is Script {
    function run() external {
        address usdc = vm.envAddress("USDC_ADDRESS");
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        address owner = vm.envAddress("OWNER_ADDRESS");

        vm.startBroadcast();

        ArcPayFactory factory = new ArcPayFactory(usdc, treasury, owner);

        vm.stopBroadcast();

        console.log("ArcPayFactory deployed at:", address(factory));
        console.log("PaymentLink:", address(factory.paymentLink()));
        console.log("Invoice:", address(factory.invoice()));
        console.log("SplitRouter:", address(factory.splitRouter()));
        console.log("EscrowVault:", address(factory.escrowVault()));
        console.log("FeeManager:", address(factory.feeManager()));
        console.log("PrivacyShield:", address(factory.privacyShield()));
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IFeeManager {
    function feeBps() external view returns (uint256);
    function feeExempt(address) external view returns (bool);
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Errors} from "./libraries/ArcPayLib.sol";

contract FeeManager is Ownable {
    using SafeERC20 for IERC20;

    uint256 public constant MAX_FEE_BPS = 100;
    uint256 public constant DEFAULT_FEE_BPS = 10;

    uint256 public feeBps;
    uint256 public totalFeesCollected;
    address public treasury;
    IERC20 public immutable USDC;

    mapping(address => bool) public feeExempt;

    event FeeCollected(address indexed from, uint256 amount);
    event FeeBpsUpdated(uint256 oldBps, uint256 newBps);
    event TreasuryUpdated(address oldTreasury, address newTreasury);
    event FeeExemptUpdated(address indexed account, bool exempt);
    event FeesWithdrawn(address indexed token, uint256 amount);

    constructor(address _usdc, address _treasury, address _owner) Ownable(_owner) {
        if (_usdc == address(0)) revert Errors.ZeroAddress();
        if (_treasury == address(0)) revert Errors.ZeroAddress();
        USDC = IERC20(_usdc);
        treasury = _treasury;
        feeBps = DEFAULT_FEE_BPS;
    }

    function setFeeBps(uint256 _bps) external onlyOwner {
        if (_bps > MAX_FEE_BPS) revert Errors.InvalidBps();
        uint256 oldBps = feeBps;
        feeBps = _bps;
        emit FeeBpsUpdated(oldBps, _bps);
    }

    function setTreasury(address _treasury) external onlyOwner {
        if (_treasury == address(0)) revert Errors.ZeroAddress();
        address old = treasury;
        treasury = _treasury;
        emit TreasuryUpdated(old, _treasury);
    }

    function setFeeExempt(address account, bool exempt) external onlyOwner {
        feeExempt[account] = exempt;
        emit FeeExemptUpdated(account, exempt);
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = USDC.balanceOf(address(this));
        if (balance > 0) {
            totalFeesCollected = 0;
            USDC.safeTransfer(treasury, balance);
            emit FeesWithdrawn(address(USDC), balance);
        }
    }

    function rescueTokens(address token, uint256 amount) external onlyOwner {
        if (token == address(USDC)) revert Errors.InvalidState();
        IERC20(token).safeTransfer(treasury, amount);
        emit FeesWithdrawn(token, amount);
    }
}

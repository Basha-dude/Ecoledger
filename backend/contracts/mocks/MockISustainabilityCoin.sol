// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {ISustainabilityCoin} from  "../../contracts/interfaces/ISustainabilityCoin.sol";


contract MockISustainabilityCoin is ISustainabilityCoin {
    // Mapping to track balances for the mock token
    mapping(address => uint256) private _balances;

    function mint(address to,uint256 amount) external override {
        // Increase the balance of the recipient
        _balances[to] += amount;
    }

    function balanceOf(address account) external view override returns (uint256) {
        // Return the balance for the specified account
        return _balances[account];
    }
}
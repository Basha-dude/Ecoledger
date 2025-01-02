// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SustainabilityCoin is ERC20 {
    // Add owner variable if you want to restrict minting
    address public owner;

    constructor(uint256 initialSupply) ERC20("SustainabilityCoin", "SUS") {
        owner = msg.sender;  // Set the deployer as owner
        _mint(msg.sender, initialSupply);  // Mint initial supply to deployer
    }

    // Optional: Add a modifier to restrict minting
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can mint");
        _;
    }

    // Optional: Add a mint function if you want to mint more tokens later
    function mint(uint256 amount) public onlyOwner {
        _mint(msg.sender, amount);
    }

    function balance() public view returns(uint256) {
        uint256 bal = balanceOf(msg.sender);
        require(bal >= 0, "Balance should be non-negative");
        return bal;
    }
}
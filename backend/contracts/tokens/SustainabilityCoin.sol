// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract SustainabilityCoin is ERC20 {
    // Add owner variable if you want to restrict minting
    address public owner;
    mapping (address => bool) IsAllowedMinter ;

    constructor(uint256 initialSupply) ERC20("SustainabilityCoin", "SUS") {
        owner = msg.sender;  // Set the deployer as owner
        _mint(msg.sender, initialSupply);  // Mint initial supply to deployer
    }

    // Optional: Add a modifier to restrict minting
    modifier onlyOwner() {
        require( IsAllowedMinter[msg.sender] || msg.sender == owner, "Not authorized to mint");
        _;
    }


    // Optional: Add a mint function if you want to mint more tokens later
    function mint(address to,uint256 amount) public onlyOwner {
        console.log("msg.sender from coin",msg.sender);
        _mint(to, amount);
    }

    function addMinter(address minter) public onlyOwner {
        IsAllowedMinter[minter] = true;
    }

    function balance() public view returns(uint256) {
        uint256 bal = balanceOf(msg.sender);
        require(bal >= 0, "Balance should be non-negative");
        return bal;
    }
}
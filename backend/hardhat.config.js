require("@nomicfoundation/hardhat-chai-matchers");
require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-ethers"); // Use only the newer ethers.js plugin

module.exports = {
  solidity: {
    version: "0.8.21",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true, // Allow unlimited contract size for the local network
    },
  },
  paths: {
    sources: "./contracts",  // Adjust the path to your contracts folder if necessary
    tests: "./test",
    cache: "./cache",
    artifacts:"../frontend/src/abi",
  },
};

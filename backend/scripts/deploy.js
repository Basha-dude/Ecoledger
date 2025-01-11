const fs = require("fs");
const path = require("path");
const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Starting deployment...");

    // Deploy SustainabilityCoin
    const SustainabilityCoin = await ethers.getContractFactory("SustainabilityCoin");
    const initialSupply = ethers.parseUnits("1000000", 18); // 1,000,000 SUS tokens with 18 decimals
    const sustainabilityCoin = await SustainabilityCoin.deploy(initialSupply);
    await sustainabilityCoin.waitForDeployment();
    
    const sustainabilityCoinAddress = await sustainabilityCoin.getAddress();
    console.log("SustainabilityCoin deployed at:", sustainabilityCoinAddress);

    // To get the balance, use either:
    // Option 1: Using contract instance
    const balance = await sustainabilityCoin.balanceOf(sustainabilityCoinAddress);
    console.log("Balance:", ethers.formatUnits(balance, 18));
    
    const totalSupply = await sustainabilityCoin.totalSupply();
    console.log("Total Supply:", ethers.formatUnits(totalSupply, 18));

    // OR Option 2: Using provider (if you want ETH balance)
    const ethBalance = await ethers.provider.getBalance(sustainabilityCoinAddress);
    console.log("ETH Balance:", ethers.formatEther(ethBalance));

    // Deploy EcoLedger as an upgradeable contract
    const EcoLedger = await ethers.getContractFactory("EcoLedger");
    const ecoLedger = await upgrades.deployProxy(EcoLedger, [sustainabilityCoinAddress], {
        initializer: "initialize",
    });
    await ecoLedger.waitForDeployment();
    
    const ecoLedgerAddress = await ecoLedger.getAddress();
    console.log("EcoLedger deployed at:", ecoLedgerAddress);

    // Output the addresses for further usage
    console.log("Deployment completed successfully!");
    console.log(`SustainabilityCoin Address: ${sustainabilityCoinAddress}`);
    console.log(`EcoLedger Proxy Address: ${ecoLedgerAddress}`);

    // Prepare the deployment data
    const deploymentData = {
        sustainabilityCoinAddress: sustainabilityCoinAddress,
        ecoLedgerAddress: ecoLedgerAddress,
    };

    // Define the path to the frontend src/abi folder
    const dirPath = path.join(__dirname, "..", "..", "frontend", "src", "abi");
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write the deployment data to a JSON file
    fs.writeFileSync(path.join(dirPath, "deployment-config.json"), JSON.stringify(deploymentData, null, 2));
    console.log("Deployment configuration saved to frontend/src/abi/deployment-config.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in deployment:", error);
        process.exit(1);
    });

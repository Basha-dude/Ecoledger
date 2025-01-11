const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("EcoLedger Contract", function () {
  let EcoLedger, ecoLedger, sustainabilityToken, owner, addr1, addr2;
  
  // Constants for fixed values
  const MAX_ANNUAL_EMISSIONS = 10000;
  const MAX_ANNUAL_WATER_USAGE = 100000;
  const WITHDRAWAL_PERCENTAGE = 2;
  const INSURANCE_PERCENTAGE = 10;


     

  // Deploy contracts before each test
  beforeEach(async function () {
    // Get the signers for testing
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the mock SustainabilityToken contract
    const ISustainabilityCoin = await ethers.getContractFactory("MockISustainabilityCoin");
    sustainabilityToken = await ISustainabilityCoin.deploy();
    const sustainabilityTokenAddress = await sustainabilityToken.getAddress();

    // Deploy the EcoLedger contract with the sustainability token address as a parameter
    EcoLedger = await ethers.getContractFactory("EcoLedger");
    ecoLedger = await upgrades.deployProxy(EcoLedger, [sustainabilityTokenAddress], {
      initializer: "initialize",
    });
  });

  // Test cases
  it("should set the correct owner during deployment", async function () {
    // Verifies that the owner of the contract is set correctly
    expect(await ecoLedger.owner()).to.equal(await owner.getAddress());
  });

  it("should set the correct sustainability token address", async function () {
    // Verifies that the sustainability token address is set correctly
    const sustainabilityTokenAddress = await sustainabilityToken.getAddress();
    expect(await ecoLedger.sustainabilityToken()).to.equal(sustainabilityTokenAddress);
  });

  it("should set the correct maxAnnualEmissions", async function () {
    // Verifies that the maxAnnualEmissions value is set correctly
    expect(await ecoLedger.maxAnnualEmissions()).to.equal(MAX_ANNUAL_EMISSIONS);
  });

  it("should set the correct maxAnnualWaterUsage", async function () {
    // Verifies that the maxAnnualWaterUsage value is set correctly
    expect(await ecoLedger.maxAnnualWaterUsage()).to.equal(MAX_ANNUAL_WATER_USAGE);
  });

  it("should set the correct withdrawalPercentage", async function () {
    // Verifies that the withdrawalPercentage value is set correctly
    expect(await ecoLedger.withdrawalPercentage()).to.equal(WITHDRAWAL_PERCENTAGE);
  });

  it("should set the correct insurancePercentage", async function () {
    // Verifies that the insurancePercentage value is set correctly
    expect(await ecoLedger.insurancePercentage()).to.equal(INSURANCE_PERCENTAGE);
  });
  it("should set the correct projectId", async function () {
    // Verifies that the insurancePercentage value is set correctly
    expect(await ecoLedger.projectId()).to.equal(0);
  });

  describe("Register function", function () {
    const DEFAULT_CARBON_PROJECT_ID = 0;
    const DEFAULT_CARBON_PROJECT_NAME = "First project";
    const MAX_ANNUAL_EMISSIONS = 1000;         // Maximum allowable emissions for a project
    const MAX_ANNUAL_WATER_USAGE = 1000;     // Maximum allowable water usage for a project
    const MIN_ANNUAL_EMISSIONS = 0;            // Minimum emissions (could be zero if there's no emission reduction)
    const MIN_ANNUAL_WATER_USAGE = 0;          // Minimum water usage (could be zero if no water usage)
    const EMISSIONS_REDUCTION_PROJECT = true;  // Default flag for emissions reduction project
    const VALIDATED_PROJECT = false;          // Default flag indicating whether the project is validated
    const PAID_PROJECT = false;  // Optionally, you could add edge case tests for invalid inputs or unexpected behavior  });

    beforeEach(async function () {
      await ecoLedger.registerProject(DEFAULT_CARBON_PROJECT_NAME,MAX_ANNUAL_EMISSIONS,MAX_ANNUAL_WATER_USAGE,true)
      await ecoLedger.registerProject(DEFAULT_CARBON_PROJECT_NAME,MAX_ANNUAL_EMISSIONS,MAX_ANNUAL_WATER_USAGE,true)

      });
  it("should register project correctly", async function () {
    // expect(await ecoLedger.projectId()).to.equal(1);
   const projects = await ecoLedger.getAllRegisteredProjects()
   console.log("projects",projects)

  });

  it("should mark project as registered", async function () { 
    // expect(await ecoLedger.isRegistered(1)).to.equal(true);
});

it("should revert when annual emissions exceed the maximum limit", async function () {
  const INVALID_ANNUAL_EMISSIONS = 10000 + 1; // Exceeds the maximum
  const VALID_WATER_USAGE = MAX_ANNUAL_WATER_USAGE - 100; // A valid water usage value
  const PROJECT_NAME = "Test Project";

  // Attempt to register a project with invalid annual emissions
  await expect(
    ecoLedger.registerProject(PROJECT_NAME, INVALID_ANNUAL_EMISSIONS, VALID_WATER_USAGE, true)
  ).to.be.revertedWith("Annual emissions must be less than 10,000 tons.");
});


it("should revert when annual water usag exceed the maximum limit", async function () {
  const INVALID_ANNUAL_EMISSIONS = 1000; // Exceeds the maximum
  const VALID_WATER_USAGE = 100000 ; // A valid water usage value
  const PROJECT_NAME = "Test Project";

  // Attempt to register a project with invalid annual emissions
  await expect(
    ecoLedger.registerProject(PROJECT_NAME, INVALID_ANNUAL_EMISSIONS, VALID_WATER_USAGE, true)
  ).to.be.revertedWith("Annual water usage must not exceed 100,000 liters.");
});

it("should revert when Project  must not  include emissions reduction.", async function () {
  const INVALID_ANNUAL_EMISSIONS = 1000; // Exceeds the maximum
  const VALID_WATER_USAGE = MAX_ANNUAL_WATER_USAGE ; // A valid water usage value
  const PROJECT_NAME = "Test Project";

  // Attempt to register a project with invalid annual emissions
  await expect(
    ecoLedger.registerProject(PROJECT_NAME, INVALID_ANNUAL_EMISSIONS, VALID_WATER_USAGE, false)
  ).to.be.revertedWith("Project must include emissions reduction.");
});



});
describe("PAY FOR CARBON + VALIDATED PROJECT FUNCTION", function () {
  let needToPay
  const DEFAULT_CARBON_PROJECT_ID = 0;
  const DEFAULT_CARBON_PROJECT_NAME = "First project";
  const MAX_ANNUAL_EMISSIONS = 1000;         // Maximum allowable emissions for a project
  const MAX_ANNUAL_WATER_USAGE = 1000;     // Maximum allowable water usage for a project
  const MIN_ANNUAL_EMISSIONS = 0;            // Minimum emissions (could be zero if there's no emission reduction)
  const MIN_ANNUAL_WATER_USAGE = 0;          // Minimum water usage (could be zero if no water usage)
  const EMISSIONS_REDUCTION_PROJECT = true;  // Default flag for emissions reduction project
  const VALIDATED_PROJECT = false;          // Default flag indicating whether the project is validated
  const PAID_PROJECT = false;  // Optionally, you could add edge case tests for invalid inputs or unexpected behavior  });

  beforeEach(async function () {
    await ecoLedger.registerProject(DEFAULT_CARBON_PROJECT_NAME,MAX_ANNUAL_EMISSIONS,MAX_ANNUAL_WATER_USAGE,true)
    const id = await ecoLedger.totalProjects();
      console.log("id",id);
    await ecoLedger.validateRegisteredProject(id)
   
    });

    it("should VALIDATE", async function () {
      const id = await ecoLedger.totalProjects();
      console.log("",id);
      
      const project = await ecoLedger.getFullCarbonProject(id); 
      const validate =await  ecoLedger.isProjectValidated(id); // Exceeds the maximum
       expect(validate).to.equal(true)


       
    });

    it("should Payfor carbon", async function () {
      const annualEmmisions = BigInt(MAX_ANNUAL_EMISSIONS) * BigInt(10 ** 18);
      const annualWaterUsage = BigInt(MAX_ANNUAL_WATER_USAGE) * BigInt(10 ** 18);
       needToPay = annualEmmisions + annualWaterUsage; 
      console.log("needToPay (in Wei):", needToPay.toString());
      await ecoLedger.payForCarbon(1,{value: needToPay});
      const id = await ecoLedger.projectId();
     const project = await ecoLedger.getFullCarbonProject(id); 
    expect(project.Paid).to.equal(true)
      
    });

    it("should revert carbon", async function () {

    await expect(ecoLedger.payForCarbon(1,{value: 0 })
    ).to.be.revertedWith("Insufficient payment.");

  });
});

});
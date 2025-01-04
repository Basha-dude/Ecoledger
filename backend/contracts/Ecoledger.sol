
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

// import "hardhat/console.sol";

import {ISustainabilityCoin} from "./interfaces/ISustainabilityCoin.sol";    
import {UUPSUpgradeable,Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol"; // If using OwnableUpgradeable



/**
 * @title EcoLedger
 * @notice carbon ledger
 * @author Basha  
 **/

contract EcoLedger is UUPSUpgradeable,OwnableUpgradeable {
    address payable  public i_owner;
    uint256 public  totalProjects;
    uint256 public projectId;
    uint256 public maxAnnualEmissions ;
    uint256 public maxAnnualWaterUsage ;
    uint256 public   withdrawalPercentage ;  
    uint256 public  insurancePercentage ;
    uint256 private constant SCALE = 1e18;
    uint256 public totalContributions;

mapping (uint => bool) public isRegistered;   
mapping (uint => CarbonProject)idToProject;
mapping (uint => bool) insuranceOrNot;
mapping (uint => bool) insuranceClaimedOrNot;
mapping(address => uint256) public contributions;

ISustainabilityCoin public  sustainabilityToken; 

    event Withdrawal(uint amount);
    event CarbonProjectEvent (
        string name,
        uint256 Annualemissions,
        uint256 AnnualWaterusage,
        bool EmissionsReductionProject,
        bool Validated 
          );
     event InsurancePurchased(
        uint256 indexed projectId, 
        uint256 amount, 
        address indexed buyer
    );
    event Contribution(
        address indexed contributor,
         uint256 amount
        );

    
    struct CarbonProject {
        uint256 id;
        string name;
        uint256 Annualemissions;
        uint256 AnnualWaterusage;
        bool EmissionsReductionProject;
        bool Validated;
        bool Paid;
    }


      CarbonProject[] public carbonProjects;


      function initialize(address tokenAddress) public initializer {
        __Ownable_init(msg.sender);  
        __UUPSUpgradeable_init();     
        sustainabilityToken = ISustainabilityCoin(tokenAddress);
        maxAnnualEmissions = 10_000;
        maxAnnualWaterUsage = 100_000;
        withdrawalPercentage = 2;  
        insurancePercentage = 10;
    }

    

    function registerProject( string calldata name,uint256 annualemissions,uint256 annualWaterusage,bool emissionsReductionProject) public  {
        require(bytes(name).length > 0, "Name should not be empty");
        require(annualemissions < 10000, "Annual emissions must be less than 10,000 tons.");
        require(annualWaterusage < 100000, "Annual water usage must not exceed 100,000 liters.");
        require(emissionsReductionProject, "Project must include emissions reduction.");
        require(!isRegistered[projectId + 1], "This project ID is already registered.");

      
        projectId++;
        

        CarbonProject memory newProject = CarbonProject({
            id: projectId, 
            name: name,
            Annualemissions: annualemissions,
            AnnualWaterusage: annualWaterusage,
            EmissionsReductionProject: emissionsReductionProject,
            Validated: false,
            Paid: false
        });
            carbonProjects.push(newProject);
            isRegistered[projectId] = true;
            idToProject[projectId] = newProject;
            totalProjects++;

          emit CarbonProjectEvent(name, annualemissions, annualWaterusage, emissionsReductionProject, false);
    }

       function payForCarbon(uint256 id)  public payable {
        require(isRegistered[id],"his project ID is not registered");
        require(idToProject[id].Validated, "This project is already validated");
        require(!idToProject[id].Paid, "This project is already Paid");
        CarbonProject storage carbonProject = idToProject[id];
        uint256 totalToPay = _calculateTotalPayment(id);  
        require(msg.value >= totalToPay, "Insufficient payment.");

        if (msg.value > totalToPay) {
            payable(msg.sender).transfer(msg.value - totalToPay);
        }
         
        uint256 weightedContribution = (carbonProject.Annualemissions *2) + (carbonProject.AnnualWaterusage *1);
         ISustainabilityCoin(sustainabilityToken).mint(msg.sender, weightedContribution);
        

         idToProject[id].Paid = true;

       }
       function _calculateTotalPayment(uint256 id) internal view  returns(uint256) {
        CarbonProject memory carbonProject = idToProject[id];
        uint256 annualEmmisions  =  carbonProject.Annualemissions * 10**18 ;
        uint256 annualWaterUsage = carbonProject.AnnualWaterusage * 10**18 ;
         
        uint256 needToPay = annualEmmisions + annualWaterUsage; 

        return needToPay;
       }


    function validateRegisteredProject(uint256 id) public onlyOwner {
        require(isRegistered[id],"his project ID is not registered");
        require(!idToProject[id].Paid, "This project is already Paid");
        CarbonProject storage carbonProject = idToProject[id];
         
        require(!carbonProject.Validated, "This project is already validated");
        carbonProject.Validated = true;

        emit CarbonProjectEvent(
            carbonProject.name,
            carbonProject.Annualemissions,
            carbonProject.AnnualWaterusage,
            carbonProject.EmissionsReductionProject,
            carbonProject.Validated
        ); 
    }


   
    function insurance(uint256 id) public payable { 
        require(isRegistered[id],"his project ID is not registered");
        require(idToProject[id].Paid, "This project is already Paid");
        require(idToProject[id].Validated, "This project is not validated");
        require(!insuranceOrNot[id], "this is project is not insurance");

       
         uint256 insuranceToPay =  _calculateInsurancePayment(id) ; 

         require(msg.value >= insuranceToPay, "Insufficient payment.");

         if (msg.value > insuranceToPay) { 
             payable(msg.sender).transfer(msg.value - insuranceToPay); 
         }
         
         insuranceOrNot[id] = true;

         emit InsurancePurchased(id, insuranceToPay, msg.sender);

    }

    function _calculateInsurancePayment(uint256 id) internal view  returns (uint256) {
        uint256 totalPay = _calculateTotalPayment(id);
         
        uint256 scaledPercentage = insurancePercentage * SCALE;
        uint256 numerator = totalPay * scaledPercentage;
        
        uint256 denominator = (100 * SCALE);
        uint256 insuranceToPay =  numerator / denominator;

        return insuranceToPay;
    }
    function claimInsurance(uint256 id)  public {
        require(isRegistered[id],"his project ID is not registered");
        require(idToProject[id].Paid, "This project is already Paid");
        require(idToProject[id].Validated, "This project is not validated");
        require(insuranceOrNot[id], "this is project is not insurance");
        require(!insuranceClaimedOrNot[id], "this is project claimed the  insurance");
        
        uint256 insuranceToRepay = _calculateInsurancePayment(id);

        payable(msg.sender).transfer(insuranceToRepay);

        insuranceClaimedOrNot[id] = true;
    }


    function withdraw() onlyOwner public  {
        uint256 contractBalance = address(this).balance;
       require(contractBalance > 0, "No funds to withdraw");
       uint256 scaledPercentage = withdrawalPercentage * SCALE;
       uint256 scaledAmount = contractBalance * scaledPercentage;
       uint256 denominator = (100 * SCALE);
       uint256 amount = scaledAmount / denominator; 
        i_owner.transfer(amount) ;
        emit Withdrawal(amount);  
    }

    function setConstraints(uint256 newMaxEmissions, uint256 newMaxWaterUsage) public onlyOwner {
        maxAnnualEmissions = newMaxEmissions;
        maxAnnualWaterUsage = newMaxWaterUsage;
    }
    

    function setWithdrawalPercentage(uint256 newPercentage) public onlyOwner {
        require(newPercentage <= 100, "Percentage cannot exceed 100");
        withdrawalPercentage = newPercentage;
    }

    function priceOfSustainabilityCoin(uint256 amount)  public pure returns (uint256) {
        uint256 priceOfCoin = 1;
        uint256 price = ((amount * priceOfCoin) *SCALE ) / SCALE; 
        return price;
         
    } 

    function buySustainabilityCoin(uint256 amount) public payable {
        uint256 toPay = priceOfSustainabilityCoin(amount);
        require(msg.value >= toPay, "Insufficient payment");   
        ISustainabilityCoin(sustainabilityToken).mint(msg.sender, amount);
    }
    function contributeTosayNoCarbon(uint256 amount) public payable {
        require(msg.value >= amount, "Insufficient payment");    
        contributions[msg.sender] += amount;
        totalContributions += amount;
        
        emit Contribution(msg.sender, amount);
        
    }

    function _authorizeUpgrade(address newImplementation) internal view override onlyOwner {    
        require(newImplementation != address(0), "New implementation cannot be address(0)");
    }

 

function getAllRegisteredProjectIds() external view returns (uint256[] memory) {
    uint256[] memory projectIds = new uint256[](totalProjects);
    for (uint256 i = 0; i < totalProjects; i++) {
        projectIds[i] = idToProject[i].id;
    }
    return projectIds;
}

function getProjectEmissionsAndWaterUsage(uint256 id) external view returns (uint256 emissions, uint256 waterUsage) {
    CarbonProject memory project = idToProject[id];
    return (project.Annualemissions, project.AnnualWaterusage);
}

function isProjectValidated(uint256 id) external view returns (bool) {
    return idToProject[id].Validated;
}

function getSustainabilityTokenBalance() external view returns (uint256) {
    return sustainabilityToken.balanceOf(address(this)); 
}

function getTotalContributions() external view returns (uint256) {
    return totalContributions;
}


function getWithdrawalPercentage() external view returns (uint256) {
    return withdrawalPercentage;
}

function getAllProjectInsuranceStatus() external view returns (bool[] memory) {
    bool[] memory insuranceStatus = new bool[](totalProjects);
    for (uint256 i = 0; i < totalProjects; i++) {
        insuranceStatus[i] = insuranceOrNot[i];
    }
    return insuranceStatus;
}


function getTotalInsuranceClaims() external view returns (uint256) {
    uint256 totalClaims = 0;
    for (uint256 i = 0; i < totalProjects; i++) {
        if (insuranceClaimedOrNot[i]) {
            totalClaims++;
        }
    }
    return totalClaims;
}

function getTotalEmissions() external view returns (uint256) {
    uint256 totalEmissions = 0;
    for (uint256 i = 0; i < totalProjects; i++) {
        totalEmissions += idToProject[i].Annualemissions;
    }
    return totalEmissions;
}

function getTotalWaterUsage() external view returns (uint256) {
    uint256 totalWaterUsage = 0;
    for (uint256 i = 0; i < totalProjects; i++) {
        totalWaterUsage += idToProject[i].AnnualWaterusage;
    }
    return totalWaterUsage;
}

function getPaidProjectsCount() external view returns (uint256) {
    uint256 paidCount = 0;
    for (uint256 i = 0; i < totalProjects; i++) {
        if (idToProject[i].Paid) {
            paidCount++;
        }
    }
    return paidCount;
}

function isProjectPaid(uint256 id) external view returns (bool) {
    return idToProject[id].Paid;
}

function getFullCarbonProject(uint256 id) external view returns (CarbonProject memory) {
    require(isRegistered[id], "Project not registered");
    return idToProject[id];
}

// Get the total insurance payment for all projects
function getTotalInsurancePayments() external view returns (uint256) {
    uint256 totalInsurance = 0;
    for (uint256 i = 0; i < totalProjects; i++) {
        totalInsurance += _calculateInsurancePayment(i); // Assuming _calculateInsurancePayment() exists
    }
    return totalInsurance;
}

function getAllRegisteredProjects() public view returns(CarbonProject[] memory) {
    return carbonProjects;

}   

   }



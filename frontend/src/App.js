import React, { useEffect, useState } from 'react';
import abi from "../src/abi/contracts/Ecoledger.sol/EcoLedger.json"
import TokenAbi from "../src/abi/contracts/tokens/SustainabilityCoin.sol/SustainabilityCoin.json"
import { ethers } from "ethers";
import deploymentConfig from './abi/deployment-config.json';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisteredProjects from './components/RegisteredProjects';
import Navbar from './components/navbar'
import Home from './components/home';
import ValidateProjects from './components/validateProjects';
import ValidatedProjects from './components/validatedProjects'
import PayProject  from "./components/PayProject";
import PaidProjects from './components/PaidProjects';
import  Inusrance  from "./components/Inusrance";
import ClaimInsurance from "./components/ClaimInsurance";
import InsurancedClaimed from "./components/InsurancedClaimed";


/* double logging happens because of react strictmode,
 the strict mode calls the useEffect twice, because of that loggin twice
  */ 


//completed the claim insurance and  remove immediately on the dom,
// need to show the  the projects which are claimed the insurance   

const App = () => {

  const { sustainabilityCoinAddress, ecoLedgerAddress } = deploymentConfig;
  const EcoLedgerAbi = abi.abi
  const sustainabilityCoinAbi = TokenAbi.abi
  const EcoLedgerAdress = ecoLedgerAddress
  const [validatedProjects, setValidatedProjects] = useState([])
  const [walletAccount, setwalletAccount] = useState("")
 const [contract, setContract] = useState(null)
 const [TokenInstance, setTokenInstance] = useState(null)
 const [notValidatedProjects, setNotValidatedProjects] = useState([])
 const [paidProjects, setPaidProjects] = useState([])
 const [hadToPaidProjects, sethadToPaidProjects] = useState([])
 const [toInsuranceProjets, setToInsuranceProjects] = useState([])
 const [projectsToClaimInsurance, setprojectsToClaimInsurance] = useState([])
 const [claimedProjects, setclaimedProjects] = useState([])


  const [projectDetails, setProjectDetails] = useState({
    name:"",
    annualemissions:"",
    annualWaterusage:"",
    emissionsReductionProject:false

  })
const [projects, setProjects] = useState([])


  const connectingWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method:"eth_requestAccounts"
        })
        setwalletAccount(accounts[0])

        //setup contract instance
        const provider  = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
       const  contractInstance = new ethers.Contract(EcoLedgerAdress,EcoLedgerAbi,signer)
       const TokenContractInstance = new ethers.Contract(sustainabilityCoinAddress,sustainabilityCoinAbi,signer)
       console.log("signer first at contract",signer);
         setTokenInstance(TokenContractInstance)
        setContract(contractInstance)
       


      } else {

        alert("please install metamask")
      }
  }

  /* 
   @params: eee accounts ,  @event window.ethereum.on("accountsChanged",handleChange)
                              nunchi vasthadhi
  */
  const handleChange = async(accounts) => {
    if (accounts.length > 0) {
    setwalletAccount(accounts[0])
    }
  }

  
  const fetchProjects =  async () => {
    if (!walletAccount) {
      alert("connect wallet to Registered projects")
       return
    }
    try {
      console.log("Getting Registered Projects");
    
     
      const getAllRegisteredProjects = await contract.getAllRegisteredProjects()
                             /* 
                               map lo project lo unna first element ni array lo ki push chesthaamu
                             */
      console.log("Fetched Projects IDs:", getAllRegisteredProjects.map(project => project[0]));
      console.log("projects from contract:", getAllRegisteredProjects);

      setProjects(getAllRegisteredProjects)
      // if (getAllRegisteredProjects) {

      //   console.log("projects from contract:", getAllRegisteredProjects);
      // }

    } catch (error) {
      console.error("Error fetching Projects :",error); 
    }
  
  }

  const ValidateTheRegister = async(id) => {
    console.log("ValidateTheRegister ID", id);
    try {

      //lekapoina vasthundi
      // const idToValidate = id.toString(); // Convert to string


      //EEE BELOW CODE LEKUNNA VASTHUNDI
      /* 
      
      ,{
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),  // Tip
        maxFeePerGas: ethers.parseUnits('20', 'gwei'),  // Max fee willing to pay
        gasLimit: 1000000
    }
      
      */
      const validateTx = await contract.validateRegisteredProject(id);

      await validateTx.wait();
    
      alert("Project validated");
      await fetchNotValidatedProjects()

     
        // Fetch the updated list of registered projects
      // await fetchProjects();
      // await fetchValidatedProjects()
      // await fetchNotValidatedProjects()      
    } catch (error) {
      console.error("Error validating project:", error);
      if (error.message.includes("project ID is not registered")) {
        alert("This project ID is not registered. Please check the project ID.");
      } else {
        alert("An error occurred while validating the project: " + error.message);
      }
    }
  }

  const fetchValidatedProjects = async() => {
    if (!walletAccount) {
      alert("connect wallet to Validated projects")
      return
    }
      try {
         const getAllRegisteredProjects = await contract.getAllRegisteredProjects()
                          /* 
                         false ayna prathi project array loki push avvuddi
                           */
         const Vprojects = getAllRegisteredProjects.filter(project => project[5] === true )
        setValidatedProjects(Vprojects)
      console.log("Vprojects",Vprojects);

      } catch (error) {
        console.log("error from fetchValidate",error);
        
    }
    
  }

  const fetchNotValidatedProjects = async() => {
    console.log("fetchNotValidatedProjects");
    try {
      const getAllRegisteredProjects = await contract.getAllRegisteredProjects()
      const notAllValidatedProjects =  getAllRegisteredProjects.filter(project => project[5] === false)
      console.log("notAllValidatedProjects",notAllValidatedProjects);
      
      setNotValidatedProjects(notAllValidatedProjects)
    } catch (error) {
      console.log("from not validated",error);
      
    }
  
    
  }

const payTotheProject = async (id) => {
  try {
      // First get contract instance if not already done
      if (!contract) {
          alert("Please connect wallet first");
          return;
      }

      // Get total payment amount
      const totalPay = await contract._calculateTotalPayment(id);
      console.log("Total payment in wei:", totalPay.toString());
      console.log("Total payment in ETH:", ethers.formatEther(totalPay));
      
      // Try sending with specific parameters
      const PayTx = await contract.payForCarbon(id, {
          value: totalPay,
            });
            const provider  = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        console.log("signer first at contract",signer.address);

            const balance = await TokenInstance.balance()
            console.log("token balance of signer",balance);
            
      
      const receipt = await PayTx.wait();
      console.log("Transaction confirmed:", receipt);
      
      alert("Payment successful!");
/* calling  this to update the latest projects to remove the paid one and 
  update the latest ones */
      await fetchHadToPaidProjects();
  } catch (error) {
      console.error("Detailed error:", {
          message: error.message,
          code: error.code,
          data: error.data,
          transaction: error.transaction
      });
      
      alert("Transaction failed. Please try again or check console for details.");
  }
};
const fetchHadToPaidProjects = async() => {
      try {
         const getAllRegisteredProjects = await contract.getAllRegisteredProjects()
          const registeredprojects = getAllRegisteredProjects.filter((project) => project[6]===false && project[5]===true)
          console.log("Filtered hadToPaidProjects Projects:", registeredprojects);            

          sethadToPaidProjects(registeredprojects)
      } catch (error) {
        console.log(error);
        
      }
}

const fetchPaidProjects = async () => {
  if(!walletAccount){
      alert("connect wallet from paid projects")
          }
          try {
            const getAllRegisteredProjects = await contract.getAllRegisteredProjects() 
            const paidprojects = getAllRegisteredProjects.filter((project) => (project[6]===true))
            console.log("Filtered Paid Projects:", paidprojects);            
            setPaidProjects(paidprojects)
          } catch (error) {
            console.log(error);
            
          }
}


const fetchToInsuranceProjets = async () => {
  try {
    // Temporary debug logs
    console.log("Fetching all projects...");
    const getAllRegisteredProjects = await contract.getAllRegisteredProjects();
    console.log("Raw projects from contract:", getAllRegisteredProjects);

    // Get insurance status for each project
    /* 
    Promise.all:

This is used when you have multiple promises and want to wait for all of them to complete
It takes an array of promises and returns a single Promise that resolves when all promises are done

 example:

Without Promise.all
const result1 = await promise1;
const result2 = await promise2;
const result3 = await promise3;

 With Promise.all - faster as they run in parallel
const [result1, result2, result3] = await Promise.all([
    promise1,
    promise2,
    promise3
]);
    */

// not used for loop for this ``If a single insuranceOrNot call fails, the entire function crashes.``

    const projectsWithInsurance = await Promise.all(
      getAllRegisteredProjects.map(async (project) => {
        console.log("project project",project);

        const isInsured = await contract.insuranceOrNot(project.id);
        console.log(`Project ${project.id} insurance status:`, isInsured);
       //here we are adding insured property to the  project(object)
        return { ...project, isInsured };
      })
    );

    // Filter logic
    const uninsuredProjects = projectsWithInsurance.filter(
      (project) => project[6] === true && project.isInsured === false // Paid is at index 6
    );
    console.log("Filtered uninsured projects:", uninsuredProjects);

    setToInsuranceProjects(uninsuredProjects);
  } catch (error) {
    console.error("Error in fetchToInsuranceProjets:", error);
  }
};

  const PayForInsurance = async(id) => {
    const valueToPay = await contract._calculateInsurancePayment(id)
     const Tx =   await contract.insurance(id,{value: valueToPay})
      await Tx.wait()
      alert("payment for insurance successful")
      // we added this, 
      // so after the payment for the insurance it immediately clears the project paid the insurance
      await fetchToInsuranceProjets();
  }    
  
  const getTheInsurance= async (id) =>{
    const Tx = await contract.claimInsurance(id)
             await Tx.wait() 
        alert("Claim successful")
      await  fetchInsuranceProjetsToClaim();

  }

  const fetchInsuranceProjetsToClaim = async() => {
      const getAllRegisteredProjects = await contract.getAllRegisteredProjects();

      const projectsWithOutInsurance = await Promise.all(
         getAllRegisteredProjects.map( async (project)=> {
          const isInsured = await contract.insuranceOrNot(project.id) 
          const claimOrNot = await contract.insuranceClaimedOrNot(project.id)
          console.log(`project ${project.id} is ${isInsured}`);
          return{...project,isInsured,claimOrNot}
        })
      )

      const projects = projectsWithOutInsurance.filter((project)=> project[6] ===true && project.isInsured ===true && project.claimOrNot ===false)
      setprojectsToClaimInsurance(projects)
  } 
  const fetchClaimedInsuranceProjets = async() => {
    const getAllRegisteredProjects = await contract.getAllRegisteredProjects();

    const projectsWithOutInsurance = await Promise.all(
       getAllRegisteredProjects.map( async (project)=> {
        const isInsured = await contract.insuranceOrNot(project.id) 
        const claimOrNot = await contract.insuranceClaimedOrNot(project.id)
        console.log(`project ${project.id} is ${isInsured}`);
        return{...project,isInsured,claimOrNot}
      })
    )

    const projects = projectsWithOutInsurance.filter((project)=> project[6] ===true && project.isInsured ===true && project.claimOrNot ===true)
    setclaimedProjects(projects)
} 


  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged",handleChange)
    }

    return () => {
      window.ethereum.removeListener("accountsChanged",handleChange)
    }

  }, [])
  
  return (
    <Router>
      {/* only we write  the components above the Routes not below it  */}
    <Navbar connectingWallet={connectingWallet} walletAccount={walletAccount} />
    <Routes>
      <Route
        path="/registered-projects"
        element={<RegisteredProjects
          projects={projects}
          fetchProjects ={fetchProjects}
          walletAccount ={walletAccount}
        />}
      />
      <Route
      path='/'
      element={<Home  projectDetails={projectDetails} setProjectDetails={setProjectDetails} contract={contract}/>}
      >
      </Route>

      <Route path='/validate-projects' 
      element={<ValidateProjects notValidatedProjects={notValidatedProjects} fetchNotValidatedProjects={fetchNotValidatedProjects} 
       walletAccount ={walletAccount}
      ValidateTheRegister={ValidateTheRegister} 
      />}>
      </Route>

      <Route path='/validatedProjects' element={<ValidatedProjects validatedProjects={validatedProjects} fetchValidatedProjects={fetchValidatedProjects} walletAccount ={walletAccount}/>}>

      </Route>

      <Route path='/payprojects' 
      element={<PayProject  
      walletAccount={walletAccount} 
      payTotheProject={payTotheProject}
      hadToPaidProjects={hadToPaidProjects}
      fetchHadToPaidProjects={fetchHadToPaidProjects}
       />}></Route>

     <Route path='/paidprojects' 
      element={<PaidProjects  
      walletAccount={walletAccount} 
      paidProjects ={paidProjects}
      fetchPaidProjects={fetchPaidProjects}
       />}></Route>

       <Route path='/insurance' element={<Inusrance  toInsuranceProjets={toInsuranceProjets} PayForInsurance={PayForInsurance} fetchToInsuranceProjets={fetchToInsuranceProjets}/>}>

       </Route>

       <Route path='/claimInsurance' element={<ClaimInsurance getTheInsurance={getTheInsurance} 
        projectsToClaimInsurance={projectsToClaimInsurance}
        fetchInsuranceProjetsToClaim={fetchInsuranceProjetsToClaim}
        walletAccount={walletAccount}/>}></Route>

        <Route path='/insuranceClaimed' element={<InsurancedClaimed
        walletAccount={walletAccount} fetchClaimedInsuranceProjets={fetchClaimedInsuranceProjets} 
         claimedProjects={claimedProjects}
         />}>

        </Route>

    </Routes>
    </Router>

  )
}

export default App
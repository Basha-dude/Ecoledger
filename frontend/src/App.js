import React, { useEffect, useState } from 'react';
import abi from "../src/abi/contracts/Ecoledger.sol/EcoLedger.json"
import { ethers } from "ethers";
import deploymentConfig from './abi/deployment-config.json';


const App = () => {

  const { sustainabilityCoinAddress, ecoLedgerAddress } = deploymentConfig;
  const EcoLedgerAbi = abi.abi
  const EcoLedgerAdress = ecoLedgerAddress
  const [validatedProjects, setValidatedProjects] = useState([])
  const [walletAccount, setwalletAccount] = useState("")
 const [contract, setContract] = useState(null)
 const [notValidatedProjects, setNotValidatedProjects] = useState([])
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

  const handleSubmit = async() => {
    
    /* 
     ikkada setContract state update late avvuddi  process kabatti ,
      so andukey if(!contract) use chesindi
    */
    
    try {
      if (!contract) {
        alert("Connect your wallet first!");
        return;
    }

    if (!projectDetails.name|| !projectDetails.annualemissions|| !projectDetails.annualWaterusage ) {
        alert("need to fill all the inputs")
        return

    }
      if (window.ethereum) {
        const emmisions = Number(projectDetails.annualemissions)
        const waterUsage = Number(projectDetails.annualWaterusage)
           const tx = await contract.registerProject(
            projectDetails.name,
            emmisions,
            waterUsage,
            projectDetails.emissionsReductionProject
           )

           //paste
           
           tx.wait()
        alert("Project registered successfully!")

      }
    
      
      setProjectDetails({
        name:"",
        annualemissions:"",
        annualWaterusage:"",
        emissionsReductionProject: false
      })
        
    }
    
    catch (error) {
      console.error("Error registering project:", error)
      alert("Error registering project: " + error.message)  
    }   
  }

  const fetchProjects = async () => {
    if (!walletAccount) {
      alert("connect wallet to Registered projects")
       return
    }
    try {
      console.log("Getting Registered Projects");
    
     
      const getAllRegisteredProjects = await contract.getAllRegisteredProjects()
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
      const idToValidate = id.toString(); // Convert to string

      const validateTx = await contract.validateRegisteredProject(idToValidate);

      await validateTx.wait();
    
      alert("Project validated");
     
        // Fetch the updated list of registered projects
      await fetchProjects();
      await fetchValidatedProjects()
      await fetchNotValidatedProjects()      
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


  

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged",handleChange)
    }

    return () => {
      window.ethereum.removeListener("accountsChanged",handleChange)
    }

  }, [])
  
  return (
    <div className='eco'><h1> ECOLEDGER </h1>
    <h2>Empowering a Greener Future Through Blockchain Innovation</h2>

    {walletAccount 
  ?`${walletAccount.substring(0,6)}...${walletAccount.substring(walletAccount.length -4)}` : 
  <button onClick={connectingWallet}>Connect Wallet</button>}

  <br />

    <label>Name: </label>
      <input name="string" value={projectDetails.name} onChange={(e)=> setProjectDetails({...projectDetails,name:e.target.value})}/>
      <br />
      <label>Tons: </label>
      <input type="number" value={projectDetails.annualemissions} onChange={(e)=>setProjectDetails({...projectDetails, annualemissions:e.target.value}) } />
      <br />
      <label>Liters: </label>
      <input type="number"  value={projectDetails.annualWaterusage} onChange={(e)=> setProjectDetails({...projectDetails, annualWaterusage:e.target.value})}/>
      <br />
      <label>
  <input 
    type="checkbox" 
    checked={projectDetails.emissionsReductionProject} 
    onChange={(e) => setProjectDetails({...projectDetails, emissionsReductionProject: e.target.checked})} 
    onKeyDown={(e) => setProjectDetails({...projectDetails,emissionsReductionProject:!projectDetails.emissionsReductionProject})}
  />
  Emissions Reduction Project
</label>

      <br />
      <button onClick={handleSubmit}>Register project</button>
      <br />

      <br />
      <button onClick={fetchProjects}>Get Registered Projects</button>
      <button onClick={fetchValidatedProjects}> VALIDATED PROJECTS</button>
      <button onClick={fetchNotValidatedProjects}> NEED VALIDATED PROJECTS</button>


      <br />

      <h2>Registered Project Details</h2>
      <>
      {projects.length > 0 ? projects.map((project) => (
   <div key={project[0]}>  {/* using the name (at index 1) as key */}
    <p>Project ID:{project[0]}</p>
    <p>{project[1]}</p>  {/* name is at index 1 */}
    <p>Annual Emissions: {project[2].toString()} Tons</p> {/* emissions at index 2 */}
    <p>Annual Waterusage:{project[3].toString()} Liters</p>
    <p>Validated:{project[5].toString()}</p>
    {project[5] ? "" : <button onClick={() => ValidateTheRegister(project[0])}>Validate</button> }
    
    <br />
    <br />
    <br />
    <br />
   
  </div>
)) : "No Registered Projects"} 
      </>
    <br />
    <br />
    <br />
   <h2>Validated Projects</h2>
     <>
      {validatedProjects.length > 0 ? validatedProjects.map((vproject) =>(

        <div key={vproject[0]}>
        <p>Project ID:{vproject[0]}</p>
    <p>{vproject[1]}</p>  {/* name is at index 1 */}
    <p>Annual Emissions: {vproject[2].toString()} Tons</p> {/* emissions at index 2 */}
    <p>Annual Waterusage:{vproject[3].toString()} Liters</p>
    <p>Validated:{vproject[5].toString()}</p>
    <br />
    <br />
    <br />
        </div>

      )) :"No Validated  Projects"}
      </>
         
    <br />
    <br />
    <br />
      <h2>Need To Validated Projects</h2>
      <>
      {notValidatedProjects.length >0 ? notValidatedProjects.map((NVproject) => (
        <div key={NVproject[0]}>
       <p>ID FROM NOT{NVproject[0]}</p>
     </div>
      )) 

        :"All ProjectsValidated "}
        </>

    </div>

    
 
    
  )
}

export default App
import React, { useEffect, useState } from 'react';
import abi from "../src/abi/contracts/Ecoledger.sol/EcoLedger.json"
import { ethers } from "ethers";


const App = () => {

  const EcoLedgerAbi = abi.abi
  const EcoLedgerAdress ="0x4A679253410272dd5232B3Ff7cF5dbB88f295319"
  const [walletAccount, setwalletAccount] = useState("")
 const [contract, setContract] = useState(null)
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

  const handleChange = async(accounts) => {
    if (accounts > 0) {
    setwalletAccount(accounts[0])
    }
  }

  const handleSubmit = async() => {
    
    /* 
     ikkada setContract synchronus process kabatti late avvuddi,
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
    try {
      console.log("Getting Registered Projects");
    
     
      const getAllRegisteredProjects = await contract.getAllRegisteredProjects()
      if (getAllRegisteredProjects) {
        setProjects(getAllRegisteredProjects)
        console.log("projects from contract:", getAllRegisteredProjects);
      }

    } catch (error) {
      console.error("Error fetching Projects :",error); 
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
      <br />

      <h2>Registered Project Details</h2>
      <>
      {projects.length > 0 ? projects.map((project) => (
   <div key={project[1]}>  {/* using the name (at index 1) as key */}
    <p>Project ID:{project[0]}</p>
    <p>{project[1]}</p>  {/* name is at index 1 */}
    <p>Annual Emissions: {project[2].toString()} Tons</p> {/* emissions at index 2 */}
    <p>Annual Waterusage:{project[3].toString()} Liters</p>
    <p>Validated:{project[4].toString()}</p>
    <br />
  </div>
)) : "No Registered Projects"}
            
      </>
    </div>
    
  )
}

export default App
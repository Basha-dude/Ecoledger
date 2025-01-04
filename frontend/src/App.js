import React, { useEffect, useState } from 'react';
import abi from "./abi/EcoLedger.json"
import { ethers } from "ethers";


const App = () => {

  const EcoLedgerAbi = abi.abi
  const EcoLedgerAdress ="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  const [walletAccount, setwalletAccount] = useState("")
 const [contract, setContract] = useState(null)
  const [projectDetails, setProjectDetails] = useState({
    name:"",
    annualemissions:"",
    annualWaterusage:"",
    emissionsReductionProject:false

  })


  const connectingWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method:"eth_requestAccounts"
        })
        setwalletAccount(accounts[0])

        //setup contract instance
        const provider  = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contractInstance = new ethers.Contract(EcoLedgerAdress,EcoLedgerAbi,signer)
        setContract(contractInstance)
        console.log("Contract :", contract);
        console.log("Contract Instance:", contractInstance);
        console.log("Signer:", signer);


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
       
      console.log("Form submitted:", projectDetails);
      setProjectDetails({
        name:"",
        annualemissions:"",
        annualWaterusage:"",
        emissionsReductionProject: false
      })
   
      
    } catch (error) {
      console.error("Error registering project:", error)
      alert("Error registering project: " + error.message)  
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
      <input type="checkbox" value={projectDetails.emissionsReductionProject} onChange={(e)=> setProjectDetails({...projectDetails, emissionsReductionProject: e.target.value})}/>  
      <br />
      <button onClick={handleSubmit}>Register project</button>
      <br />

      <h2>projectDetails</h2>
    </div>
    
  )
}

export default App
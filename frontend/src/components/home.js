
import React from 'react'

const Home = ({projectDetails,setProjectDetails,contract}) => {

    
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
  return ( 
   
    <div> {/* @value :- It ensures that the input field always displays
    the value that is stored in the React state and it is controlled by react not DOM */}
    <h1>HOME</h1>
    <br />
    
    <label>name:</label>

   <input type='text' value={projectDetails.name} onChange={(e) => setProjectDetails({...projectDetails,name:e.target.value})}></input>
   <br />
   <label>annualemissions:</label>
   <input type='number' value={projectDetails.annualemissions} onChange={(e)=> setProjectDetails({...projectDetails,annualemissions:e.target.value})}></input>
   
   <br />
   <label>annualWaterusage:</label>
   <input type='number' value={projectDetails.annualWaterusage} onChange={(e) => setProjectDetails({...projectDetails,annualWaterusage:e.target.value})}></input>
   
   <br /><label>emissionsReductionProject:</label>
     <input type='checkbox' checked={projectDetails.emissionsReductionProject}
      onChange={(e) => setProjectDetails({...projectDetails,emissionsReductionProject:e.target.checked})} 
      onKeyDown={(e)=> setProjectDetails({...projectDetails,emissionsReductionProject:!projectDetails.emissionsReductionProject})}
     ></input> 
       <br />
     <button onClick={handleSubmit}>REGISTER THE PROJECT</button></div>
  )
}

export default Home
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
    <p>Paid:{project[6].toString()}</p>
    {project[5] ? "" : <button onClick={() => ValidateTheRegister(project[0])}>Validate</button> }
    {project[6] ? "" : <button onClick={() => payTotheProject(project[0])}>PAY</button>}
    
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

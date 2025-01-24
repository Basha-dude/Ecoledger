import React from 'react'
import  { useEffect } from 'react';


const ValidateProjects = ({projects, walletAccount,ValidateTheRegister}) => {

  useEffect(() => {
   
      const loadProjects = async () => {
        if (walletAccount) {
          console.log("Fetching projects for wallet from ValidateProjects:", walletAccount);
          // Don't call ValidateTheRegister here since it needs an ID
          // Instead, pass fetchValidatedProjects as a prop if you need initial loading
        } else {
          alert("Connect wallet to view ValidateProjects projects");
        }
      };
      
      loadProjects();
    }, [walletAccount]);
  return (
    <div>
          <h1>Validate Project </h1>
          <br />
          {projects.length >0  ? projects.map((project)=>(
            <div key={project[0]}>
            <p>Project ID: {project[0]}</p>
            <p>Name: {project[1]}</p>
            <p>Annual Emissions: {project[2].toString()} Tons</p>
            <p>Annual Water Usage: {project[3].toString()} Liters</p>
            <p>Validated: {project[5].toString()}</p>
            <p>Paid: {project[6].toString()}</p>
            {project[5] ? "" : <button onClick={() => ValidateTheRegister(project[0])}>Validate</button> }
            <br/>
            <br />
            </div>
          ))  :"No validated projects"}

    
   </div>
  )
}



export default ValidateProjects



/* 

<div>
      <h1>Validated Project </h1>
      {validatedProjects ? validatedProjects.map((project) => (
        <div key={project[0]}>
          <p>Project ID: {project[0]}</p>
          <p>Name: {project[1]}</p>
          <p>Annual Emissions: {project[2].toString()} Tons</p>
          <p>Annual Water Usage: {project[3].toString()} Liters</p>
          <p>Validated: {project[5].toString()}</p>
          <p>Paid: {project[6].toString()}</p>
          {!project[5] && (
            <button onClick={() => ValidateTheRegister(project[0])}>
              Validate
            </button>
          )}
        </div>
      )) : "No validated projects"}
    </div>
  );
};
The key changes are:

Don't call ValidateTheRegister in useEffect since it needs a specific project ID
Only use ValidateTheRegister in the button click handler where you have access to the project ID
Pass fetchValidatedProjects as a separate prop if you need initial data loading

Would you like me to help you set up the initial data loading as well? CopyRetryClaude does not have the ability to run the code it generates yet.Claude can make mistakes. Please double-check responses.

*/

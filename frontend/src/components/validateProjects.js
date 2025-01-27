import React from 'react'
import  { useEffect } from 'react';
//fetchNotValidatedProjects

const ValidateProjects = ({notValidatedProjects,fetchNotValidatedProjects, walletAccount,ValidateTheRegister}) => {
/* double logging happens because of react strictmode,
 the strict mode calls the useEffect twice, because of that loggin twice
  */

  useEffect(() => {/* only triggers when the component mounts
                      and the variable in the dependence array changes  */
   
      const loadProjects = async () => {
        if (walletAccount) {
          console.log("Fetching projects for wallet from ValidateProjects:", walletAccount);
          // Don't call ```ValidateTheRegister``` here since it needs an ID
          /*
          which means for first time to see it on the dom 
           this is for when the component mounts , it will show it on the dom,
            if it is not there, the projects will go into the `notValidatedProjects` array
             */ 
          await fetchNotValidatedProjects()

        } 
      };
      
      loadProjects();
    }, [walletAccount]);
  return (
    <div>
          <h1>Validate Project </h1>
          <br />
          {notValidatedProjects.length >0  ? notValidatedProjects.map((project)=>(
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

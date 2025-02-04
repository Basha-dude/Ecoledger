import React from 'react';
import  { useEffect } from 'react';

/* 


*COMPONENT RENDER AYPOYETAPPUDU LOAD AVTHUNDHI
*/

const RegisteredProjects =  ({ projects, fetchProjects,walletAccount }) => {
  /* double logging happens because of react strictmode,
 the strict mode calls the useEffect twice, because of that loggin twice
  */
  useEffect(() => {
    const loadProjects = async () => {
      if (walletAccount) {
        await fetchProjects();
      }
    
    };

    loadProjects();
  }, [walletAccount]); 
  return (
    <div>
   
      <h1>Registered Project Details</h1>
      <br />
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project[0]}>
            <p>Project ID: {project[0]}</p>
            <p>Name: {project[1]}</p>
            <p>Annual Emissions: {project[2].toString()} Tons</p>
            <p>Annual Water Usage: {project[3].toString()} Liters</p>
            <p>Validated: {project[5].toString()}</p>
            <p>Paid: {project[6].toString()}</p>
            <br/>
            <br />
      
          </div>
        ))
      ) :  (
        <p>No Registered Projects</p>
      )}
    </div>
  );
};

export default RegisteredProjects;

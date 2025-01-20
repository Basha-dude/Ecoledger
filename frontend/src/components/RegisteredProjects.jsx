import React from 'react';
import  { useEffect } from 'react';


const RegisteredProjects =  ({ projects, fetchProjects,walletAccount }) => {
  useEffect(() => {
    const loadProjects = async () => {
      if (walletAccount) {
        console.log("Fetching projects for wallet:", walletAccount);
        await fetchProjects();
      } else {
        console.log("Wallet not connected. Skipping fetch.");
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

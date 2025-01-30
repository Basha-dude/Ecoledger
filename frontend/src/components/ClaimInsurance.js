import React from 'react'
import {useEffect}  from "react";

const ClaimInsurance = ({getTheInsurance,projectsToClaimInsurance,fetchInsuranceProjetsToClaim,walletAccount}) => {

    useEffect(() => {
       if (walletAccount) {
        const loadprojectsToClaimInsurance= async () =>{
            await fetchInsuranceProjetsToClaim();
               } 
               loadprojectsToClaimInsurance();
       }
      
         
        }, [])
   
    
  return (
    <div>Claim Insurance
     <br />
          {projectsToClaimInsurance.length > 0 ? projectsToClaimInsurance.map((project)=>(
            <div key={project[0]}>
            <p>Project ID: {project[0]}</p>
            <p>Name: {project[1]}</p>
            <p>Annual Emissions: {project[2].toString()} Tons</p>
            <p>Annual Water Usage: {project[3].toString()} Liters</p>
            <p>Validated: {project[5].toString()}</p>
            <p>Paid: {project[6].toString()}</p>
             <button onClick={() => getTheInsurance(project[0])}>Claim the  Insurance</button> 
            <br/>
            <br />
            </div>
          ))  :"Empty"}
    </div>
  )
}

export default ClaimInsurance
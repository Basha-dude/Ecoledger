import React from 'react'
import { useEffect } from "react";

const InsurancedClaimed = ({walletAccount,fetchClaimedInsuranceProjets,claimedProjects}) => {
     useEffect(() => {
           if (walletAccount) {
            const loadClaimedInsuranceProjets= async () =>{
                await fetchClaimedInsuranceProjets();
                   } 
                   loadClaimedInsuranceProjets();
           }
             
            }, [])
  return (
    <div>Insurance Claimed
     <br />
          {claimedProjects.length > 0 ? claimedProjects.map((project)=>(
            <div key={project[0]}>
            <p>Project ID: {project[0]}</p>
            <p>Name: {project[1]}</p>
            <p>Annual Emissions: {project[2].toString()} Tons</p>
            <p>Annual Water Usage: {project[3].toString()} Liters</p>
            <p>Validated: {project[5].toString()}</p>
            <p>Paid: {project[6].toString()}</p>
            <p>InsurancedClaimed:{project.isInsured.toString()}</p>

            <br/>
            <br />
            </div>
          ))  :"Empty"}

    </div>
  )
}

export default InsurancedClaimed
import { useEffect } from "react"
import React from 'react'

const Inusrance = ({toInsuranceProjets,PayForInsurance,fetchToInsuranceProjets}) => {
    useEffect(() => {
        const loadToInsuranceProjets = async() => {
            await fetchToInsuranceProjets()

        }
        loadToInsuranceProjets();
    }, [])
    
  return (
    <div>Inusrance Projects
     <br />
          {toInsuranceProjets.length > 0 ? toInsuranceProjets.map((project)=>(
            <div key={project[0]}>
            <p>Project ID: {project[0]}</p>
            <p>Name: {project[1]}</p>
            <p>Annual Emissions: {project[2].toString()} Tons</p>
            <p>Annual Water Usage: {project[3].toString()} Liters</p>
            <p>Validated: {project[5].toString()}</p>
            <p>Paid: {project[6].toString()}</p>
             <button onClick={() => PayForInsurance(project[0])}>Pay For Insurance</button> 
            <br/>
            <br />
            </div>
          ))  :"Empty"}
          </div>
  )
}

export default Inusrance
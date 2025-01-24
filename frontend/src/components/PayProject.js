import React from 'react'
import  { useEffect } from 'react';

//in need write the pay for the Carbon instead of NotValidatedProjects in this component
const PayProject = ({walletAccount,payTotheProject,projects}) => {
    useEffect(() => {
        const loadPayProjects = async () =>{
            if (walletAccount) {
            console.log("Pay projects");
           
            }
        };
        loadPayProjects()
     
    }, [walletAccount])
    
  return (
    <div>Pay Projects
    <br />
    <br />
    {projects.length > 0 ? 
        projects.map((project)=> (
        <div key={project[0]}>
       <p> Project ID:- {project[0]} </p>
       <p> Name: {project[1]} </p>
      <p> Annual Emissions: {project[2]} Tons </p>
      <p >Annual Water Usage: {project[3]} Liters </p>

    { project[6] ?  (<p> Paid:{project[6].toString()}  </p>) : <button onClick={() => payTotheProject(project[0])}>Pay</button>}
    <br/>
    <br/>
    <br/>
        </div>
       ))
      : "All Projects are Paid"}   
    </div>
    
  )
}

export default PayProject
import React from 'react'
import  { useEffect } from 'react';

const PayProject = ({walletAccount,payTotheProject,hadToPaidProjects,fetchHadToPaidProjects}) => {
  /* double logging happens because of react strictmode,
 the strict mode calls the useEffect twice, because of that loggin twice
  */
    useEffect(() => {
        const loadPayProjects = async () =>{
            if (walletAccount) {
            console.log("Pay projects");
            /*
            this is for when the component mounts , it will show it on the dom,
            if it is not there, the projects will go into the `hadToPaidProjects` array
             */ 
             await fetchHadToPaidProjects()
            }
        };
        loadPayProjects()
     
    }, [walletAccount])
    
  return (
    <div>Pay Projects
    <br />
    <br />
    {hadToPaidProjects.length > 0 ? 
      hadToPaidProjects.map((project)=> (
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
      : "Empty"}   
    </div>
    
  )
}

export default PayProject
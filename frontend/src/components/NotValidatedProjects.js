import React from 'react'
import  { useEffect } from 'react';

//in need write the pay for the Carbon instead of NotValidatedProjects in this component
const NotValidatedProjects = ({fetchNotValidatedProjects,walletAccount,notValidatedProjects,ValidateTheRegister}) => {
    useEffect(() => {
        const loadNotValidatedProjects = async () =>{
            if (walletAccount) {
            console.log("into not validated projects");
            await fetchNotValidatedProjects();
            }
            else {
                console.log("Wallet not connected. Skipping fetch.");
              }
            
        };
        loadNotValidatedProjects()
     
    }, [walletAccount])
    
  return (
    <div>NotValidatedProjects
    <br />
    <br />
    {notValidatedProjects.length > 0 ? 
       notValidatedProjects.map((Nproject)=> (
        <div key={Nproject[0]}>
       <p> Project ID:- {Nproject[0]} </p>
       <p> Name: {Nproject[1]} </p>
      <p> Annual Emissions: {Nproject[2]} Tons </p>
      <p >Annual Water Usage: {Nproject[3]} Liters </p>

    { Nproject[5] ?  (<p> Validated:{Nproject[5]}  </p>) : <button onClick={() => ValidateTheRegister(Nproject[0])}>Validate</button>}

   
        </div>
       ))
      : "All Projects are validated"}
    </div>
    
  )
}

export default NotValidatedProjects
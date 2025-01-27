import React, { useEffect } from 'react'

const PaidProjects = ({walletAccount,paidProjects,fetchPaidProjects}) => {
  /* double logging happens because of react strictmode,
 the strict mode calls the useEffect twice, because of that loggin twice
  */
    useEffect(() => {
        const loadfetchPaidProjects = async () => {
            if (walletAccount) {
              console.log("Fetching projects for wallet from:", walletAccount);
              await fetchPaidProjects();
            }
              };
          
              loadfetchPaidProjects();
    }, [walletAccount])
    
  return (
    <div>PaidProject:
    <br/>
    { paidProjects.length > 0 ? paidProjects.map((project) => (
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
    )) : "Empty"}
    </div>
  )
}

export default PaidProjects
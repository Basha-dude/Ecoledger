import React from 'react'
import  { useEffect } from 'react';


const ValidatedProjects = ({validatedProjects,fetchValidatedProjects,walletAccount}) => {
  /* double logging happens because of react strictmode,
 the strict mode calls the useEffect twice, because of that loggin twice
  */
     useEffect(() => {

     const loadProjects = async () => {
      if (walletAccount) {
        console.log("Fetching projects for wallet from:", walletAccount);
        await fetchValidatedProjects();
      }
        };
    
        loadProjects();
      }, [walletAccount]); 
  return (
    <div>
        <h1> Validated Projects</h1>
        <br />
        {validatedProjects.length > 0 ? validatedProjects.map((vproject) =>( 
<div key={vproject[0]}>
<p>Project ID:{vproject[0]}</p>
<p>{vproject[1]}</p>  {/* name is at index 1 */}
<p>Annual Emissions: {vproject[2].toString()} Tons</p> {/* emissions at index 2 */}
<p>Annual Waterusage:{vproject[3].toString()} Liters</p>
<p>Validated:{vproject[5].toString()}</p>
<br />
<br />
<br />
</div>

)) :"No Validated  Projects"}



    </div>
  )
}

export default ValidatedProjects
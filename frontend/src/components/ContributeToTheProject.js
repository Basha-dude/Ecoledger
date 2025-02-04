import React from 'react'
import { useState } from 'react';
import { ethers } from "ethers";



const ContributeToTheProject = ({contract}) => {
    const [amount, setAmount] = useState(''); // State to store the input valu
    const Contribute = async () => {
        console.log("amount", amount);
    
        if (!amount) {
          alert("Please enter an amount");
          return;
        }
    
        try {
          const amountInWei = ethers.parseEther(amount); // No need for `toString()`
          const tx = await contract.contributeTosayNoCarbon(amount, { 
            value: amount 
          });
          await tx.wait();
          alert("Contribution successful");
          setAmount('')
        } catch (error) {
          console.error("Contribution failed:", error);
        }
      };
    

    const handleInputChange = (e) => {
        setAmount(e.target.value); // Update the amount whenever the input changes
      };
  return (
    <div>ContributeToTheProject
    <br />
    <label>Contribute:</label>
    <input
      type="number"
    value={amount}
    onChange={handleInputChange}
        placeholder="Enter amount">

      </input>
    {/* 
      *This ensures that Contribute(amount) gets called only when the button is clicked,
       not immediately when the component renders.

       * why it calls because Contribute function has `()` paranthasees so it immidiatly call

       * but here
                 <button onClick={() => Contribute}>Contribute</button>

        with no arguments means not having the paranthasis it will refernce not calls
        so the point is if it has paranthasis it would immediately calls on ```component renders```
       ✅ This is correct.
       
     */}
    <button onClick={() => Contribute()}>Contribute</button>
    
    
    </div>
  )
}

export default ContributeToTheProject
import React, { useEffect } from 'react'
import { useState } from 'react';
import { ethers } from "ethers";



const ContributeToTheProject = ({contract,TokenInstance,walletAccount}) => {
    const [amount, setAmount] = useState(''); 
    const [coinAmount, setcoinAmount] = useState("")
    const [totalContributions, settotalContributions] = useState("")
    const [contractBalance, setcontractBalance] = useState("")
    const [tokenBalanceOfUser, settokenBalanceOfUser] = useState("")
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
          await getTotalContributions()
          await balance()

          setAmount('')
        } catch (error) {
          console.error("Contribution failed:", error);
        }
      };
      const buyCoin = async() => {
        console.log("amount", coinAmount);
    
        if (!coinAmount) {
          alert("Please enter an amount");
          return;
        }
    
        try {
            const CoinPrice = await contract.priceOfSustainabilityCoin(coinAmount)
            console.log("CoinPrice",CoinPrice);
            
            const buyTx = await contract.buySustainabilityCoin(coinAmount,{value:CoinPrice})
            await buyTx.wait()
          alert("Coin Contribution successful");
          await getTotalContributions()
          await balance()
          await getTokenBalanceOfSigner()

          setcoinAmount('')
        } catch (error) {
          console.error("Contribution failed:", error);
        }
        
      }
      const Withdraw = async() => {
        const withdrawTx = await contract.withdraw()
         await withdrawTx.wait()
         await balance()
         alert("withdraw successful")
      }
      const balance = async() => {
                const balance = await contract.contractBalance()
                setcontractBalance(balance)
      }
  
    const handleInputChange = (e) => {
        setAmount(e.target.value); // Update the amount whenever the input changes
      };
      const handleCoinAmount = (e) =>{
        setcoinAmount(e.target.value)
      }
      const getTotalContributions = async() => {
        const getTotalContributionsFromContract = await contract.getTotalContributions()
        console.log("getTotalContributionsFromContract",getTotalContributionsFromContract);
        
         settotalContributions(getTotalContributionsFromContract)
      }
      /* 
      ERROR: ikkada error ichidhi cannot read properties of balanceOf ani so 
       if (!TokenInstance) {
          console.log("TokenInstance is not available.");
          return;
        } eee condition pettina tharvatha error ivvaledhu
      */
      const getTokenBalanceOfSigner = async() => {
        if (!TokenInstance) {
          console.log("TokenInstance is not available.");
          return;
        }
          const provider  = new ethers.BrowserProvider(window.ethereum)
           const signer = await provider.getSigner()
        const tokenBalance = await TokenInstance.balanceOf(signer.address)
        settokenBalanceOfUser(tokenBalance)
      }
      useEffect(() => {
        const loadgetTokenBalanceOfSigner = async() =>{
          await getTokenBalanceOfSigner()
        }
      
        loadgetTokenBalanceOfSigner()
        
      }, [walletAccount])
      
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
    <button onClick={Contribute}>Contribute</button>
    <br />

    <label>Contribute:</label>
    <input
      type="number"
    value={coinAmount}
    onChange={handleCoinAmount}
        placeholder="Enter amount">

      </input>

      <button onClick={buyCoin}>Buy Coin</button>
      <br />
      <br />

      <p>TotalContributions: {totalContributions ? totalContributions : 0}</p>

      <br />
      <br />
      <br />
      <br />
      <button onClick={Withdraw}>Withdraw</button>
      <p>Contract Balance:{contractBalance ? contractBalance : 0} Wei</p>
      <br />
      <br />
      <br />
      <br />
      <p>User's:{tokenBalanceOfUser ? tokenBalanceOfUser : 0} Coins</p>

    
    </div>
  )
}

export default ContributeToTheProject
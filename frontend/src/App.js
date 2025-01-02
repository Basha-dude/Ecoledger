import React, { useState } from 'react';


const App = () => {
  const [connectWallet, setConnectWallet] = useState("")

  const connectingWallet = async () => {
      console.log("button clicked");
      if (window.ethereum) {
        console.log(" yes window.ethereum");
       
        const accounts = await window.ethereum.request({
          method:"eth_requestAccounts"
        })
        console.log("accounts",accounts);
        setConnectWallet(accounts[0])
        console.log(connectWallet);
        

      } else {
        console.log(" no window.ethereum");

        alert("please install metamask")
      }
      
      
  }
  return (
    <div className='eco'><h1> ECOLEDGER </h1>
    <h2>Empowering a Greener Future Through Blockchain Innovation</h2>
    name:<input name='string'></input>
    tons:<input type='number'></input>
    liters:<input type='number'></input>
    <input type="checkbox" />  
  
  {connectWallet 
  ?`${connectWallet.substring(0,6)}...${connectWallet.substring(connectWallet.length -4)}` : 
  <button onClick={connectingWallet}>Connect Wallet</button>}
    
    
    
    </div>
    
  )
}

export default App
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({connectingWallet,walletAccount}) => {
  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '10px', backgroundColor: '#f4f4f4' }}>
      <Link to="/">Home</Link>
      <Link to="/registered-projects">Registered Projects</Link>
      <Link to="/validate-projects">Validate Projects</Link>
      <Link to="/validatedProjects"> Validated Projects</Link>
      <Link to="/payprojects">Pay Projects</Link>
      <Link to="/paidprojects">Paid Projects</Link>
      <Link to="/insurance">Insurance</Link>
      <Link to="/claimInsurance">Claim Insurance</Link>

    {  walletAccount ? `${walletAccount.substring(0,6)}...${walletAccount.substring(walletAccount.length -4)}`:  <button onClick={connectingWallet}> CONNECT WALLET</button>}

    </nav>
  );
};

export default Navbar;

import './NavBar.css'
import React from 'react'
import {Link} from 'react-router-dom'



export const NavBar = () => { 
  return (
    <div >
        <h1  className='container'>KRYPTOBIRDZ MARKETPLACE</h1>
         <ul className='container'>
          <li><Link to="/">MarketPlace</Link></li>
          <li><Link to="/My-nft">My Nft</Link></li>
          <li><Link to="/Mint-item">Mint Tokens</Link></li>
          <li><Link to="/Account-dashboard">Account Dashboard</Link></li>
          </ul>
       
    </div>
  )
}


export default NavBar;
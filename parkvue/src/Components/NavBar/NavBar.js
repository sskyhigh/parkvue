import React from 'react';
import '../NavBar/NavBar.css'; // Import NavBar CSS file
import ParkvueLogo from '../ParkvueLogo/ParkvueLogo';
import SignUp from './SignUp';
import SignIn from './SignIn';

function NavBar() {
  return (
    <header>
      <ParkvueLogo />

      <div className="bx_bx-menu" id="menu-icon"></div>
      <ul className="navbar">
        <li><a href="#App.js">Home</a></li>
        <li><a href="#map.js">Map</a></li>
        <li><a href="#rewards">Rewards</a></li>
        <li><a href="#about">About</a></li>
      </ul>

      <div className="header-btn">
        <SignUp />
        <SignIn />
      </div>
    </header>
  );
}

export default NavBar;

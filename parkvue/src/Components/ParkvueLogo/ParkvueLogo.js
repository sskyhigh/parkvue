import React from 'react';
import logo from '../../img/parkvue_logo.png';// Please update the path accordingly when image is moved
import '../ParkvueLogo/ParkvueLogo.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="about_us.js" className="logo-link">
        <img src={logo} alt="parkvue" className="logo-img" />
      </a>
      {/* Add your navigation links here */}
    </nav>
  );
};

export default Navbar;

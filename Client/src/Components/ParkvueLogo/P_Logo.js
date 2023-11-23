import React from 'react';
import P_Logo from '../../img/p_logo.png'; // Please update the path accordingly when image is moved
import '../ParkvueLogo/ParkvueLogo.css'
import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <img src={P_Logo} alt="parkvue" className="p_logo-img"/>
            </Link>
        </nav>
    );
};

export default Navbar;
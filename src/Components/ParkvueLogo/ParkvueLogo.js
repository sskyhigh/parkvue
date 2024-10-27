import React from 'react';
import logo from '../../img/parkvue_logo.png'; // Please update the path accordingly when image is moved
import './ParkvueLogo.css'
import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <img src={logo} alt="parkvue" className="logo-img"/>
            </Link>

            {/*<a href="aboutPage.js" className="logo-link">*/}
            {/* Add your navigation links here */}
            {/*</a>*/}

        </nav>
    );
};

export default Navbar;

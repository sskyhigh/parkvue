import React from 'react';
import logo from '../../img/parkvue_logo.png'; // Please update the path accordingly when image is moved
import '../ParkvueLogo/ParkvueLogo.css'
import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <img src={logo} alt="parkvue" className="logo-img"/>
            </Link>


            {/*<a href="aboutPage.js" className="logo-link">*/}
            {/*</a>*/}

            {/* Add your navigation links here */}
        </nav>
    );
};

export default Navbar;

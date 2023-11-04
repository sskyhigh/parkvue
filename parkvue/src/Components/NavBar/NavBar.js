import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
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
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/map">Map</Link></li>
                <li><Link to="/rewards">Rewards</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>

            <div className="header-btn">
                <SignUp />
                <SignIn />
            </div>
        </header>
    );
}

export default NavBar;

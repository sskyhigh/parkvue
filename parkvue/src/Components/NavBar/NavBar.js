import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import '../NavBar/NavBar.css'; // Import NavBar CSS file
import ParkvueLogo from '../ParkvueLogo/ParkvueLogo';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Logout from "./Logout";
import axios from "axios";

function NavBar() {
    const [log, setLog] = useState(!!localStorage.access)

    return (
        <header>
            <ParkvueLogo/>
            <div className="bx_bx-menu" id="menu-icon"></div>
            <ul className="navbar">
                {/*home is undecided.*/}
                <li><Link to="/">Home</Link></li>
                <li><Link to="/map">Map</Link></li>
                <li><Link to="/rewards">Rewards</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
            <div className="header-btn">
                <SignUp/>
                <SignIn/>
                <Logout/>
            </div>
        </header>
    );
}

export default NavBar;

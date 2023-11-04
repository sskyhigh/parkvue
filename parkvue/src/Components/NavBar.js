import '../../src/App.css';
// import logo from '../img/new_parkvue_logo.png';
import SignUp from '../Components/SignUp'
import SignIn from '../Components/SignIn'
import {Link} from "react-router-dom";
import logo from "../img/parkvue_logo.png";
import React from "react";

function NavBar() {
    return (
        <header>
            <a href="#" className="logo_img">
                {/* <img src={logo} alt={'test'}/> */}
            </a>

            <div className="bx_bx-menu" id="menu-icon"></div>
            <ul className="navbar">
                <li>Home</li>
                <li>Map</li>
                <li>Rewards</li>
                <li>About</li>
            </ul>
            <div className="header-btn">
                <SignUp/>
                <SignIn/>
            </div>
        </header>
    );
}

export default NavBar;
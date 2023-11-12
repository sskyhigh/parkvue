import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import '../NavBar/NavBar.css'; // Import NavBar CSS file
import ParkvueLogo from '../ParkvueLogo/ParkvueLogo';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Logout from "./Logout";

function NavBar() {
    /*checks to see if there is a token*/
    const isSignedIn = !!localStorage.getItem("token");
    const navigate = useNavigate();

    const SignOut = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }

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
                {isSignedIn ? (
                    <>
                       <button onClick={SignOut}>Sign Out</button>
                    </>
                ) : (
                    <>
                        <SignUp/>
                        <SignIn/>
                    </>
                )}
            </div>
        </header>
    );
}

export default NavBar;

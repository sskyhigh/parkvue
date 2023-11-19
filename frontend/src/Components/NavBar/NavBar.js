import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import '../NavBar/NavBar.css'; // Import NavBar CSS file
import ParkvueLogo from '../ParkvueLogo/ParkvueLogo';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Logout from "./Logout";

import{AppBar, Box, Container, IconButton, Toolbar, Typography} from '@mui/material';
import {Menu} from '@mui/icons-material';
import P_Logo from '../ParkvueLogo/P_Logo';
// import Sidebar from './sidebar/Sidebar';


// const NavBar = () => {
//
//     const SignOut = () => {
//         localStorage.removeItem("token");
//         navigate('/login');
//     }

function NavBar() {
return (
        <AppBar>  {/*Fills page 100%*/}
            {/*Large Device UX/UI*/}
            <Container maxWidth='lg'>
                <Toolbar disableGutters>  {/*Removes side padding*/}

                    <Typography
                        variant='h6'
                        compnent='h1'
                        noWrap
                        sx={{flexGrow:1, display:{xs:'none', md:'flex'}}}
                        >
                        <ParkvueLogo/>
                        <div className="bx_bx-menu" id="menu-icon"></div>
                        <ul className="navbar">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/map">Map</Link></li>
                            <li><Link to="/rewards">Rewards</Link></li>
                            <li><Link to="/about">About</Link></li>
                        </ul>

                        <div className="header-btn">
                        <SignIn/>
                        {/*<SignUp/>*/}
                        </div>
                    </Typography>

                    {/*Small Device UX/UI*/}
                    <Typography
                        variant='h6'
                        compnent='h1'
                        noWrap
                        sx={{flexGrow:1, display:{xs:'flex', md:'none'}}}
                    >
                        <P_Logo/>
                        <Box sx={{mr:1}}>
                            <IconButton size='large'>
                                <Menu />  {/*Drawer icon*/}
                            </IconButton>
                        </Box>
                    </Typography>
                    <div className="header-btn">
                        <SignIn/>
                        {/*<SignUp/>*/}
                    </div>
                </Toolbar>
            </Container>
        </AppBar>
);
}

export default NavBar;

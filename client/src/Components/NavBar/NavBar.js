import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import './NavBar.css'; // Import NavBar CSS file
import Parkvue from '../ParkvueLogo/ParkvueLogo';
import SignUp from "../Login_Sign_out/SignUp";
import SignIn from "../Login_Sign_out/SignIn";
// import Logout from "./Logout";

import{AppBar, Box, Container, IconButton, Toolbar, Typography} from '@mui/material';
import {Menu} from '@mui/icons-material';
import P_Logo from '../ParkvueLogo/P_Logo';
// import Sidebar from './sidebar/Sidebar';

const NavBar = () => {
    return (
        <AppBar>  {/*Fills page 100%*/}
            <Container maxWidth='lg'>
                <Toolbar disableGutters>  {/*Removes padding from sides*/}
                    <Typography
                        variant='h6'
                        compnent='h1'
                        noWrap
                        sx={{flexGrow:1, display:{xs:'none', md:'flex'}}}
                        >
                        <Parkvue/>
                        {/*<div className="bx_bx-menu" id="menu-icon"></div>*/}
                        <ul className="navbar">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/map">Map</Link></li>
                            <li><Link to="/rewards">Rewards</Link></li>
                            <li><Link to="/about">About</Link></li>
                        </ul>
                    </Typography>
                    <SignUp/>
                    <SignIn/>
                    {/*small screen view*/}
                    <Typography
                        variant='h6'
                        compnent='h1'
                        noWrap
                        sx={{flexGrow:1, display:{xs:'flex', md:'none'}}}
                    >
                        <P_Logo/>
                        <Box sx={{mr:1}}>
                            <IconButton size='large' color='inherit'>
                                <Menu />  {/*Drawer icon*/}
                            </IconButton>
                        </Box>
                    </Typography>
                    <SignIn/>
                    <SignUp/>
                </Toolbar>
            </Container>
        </AppBar>
      )
    }
    export default NavBar

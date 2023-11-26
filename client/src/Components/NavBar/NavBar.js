import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Import NavBar CSS file
import Parkvue from '../ParkvueLogo/ParkvueLogo';
// import SignUp from "../NavBar/Sign_In_Up/SignUp";
import SignIn from "../NavBar/Sign_In_Up/SignIn";
import { AppBar, Box, Container, IconButton, Toolbar, Typography, Button } from '@mui/material';
import { Menu } from '@mui/icons-material';
import P_Logo from '../ParkvueLogo/P_Logo';
// import Sidebar from './sidebar/Sidebar';

const NavBar = () => {
    return (
        <AppBar>
            <Container maxWidth='lg'>

                {/* Fills page 100% */}
                <Toolbar disableGutters>
                    <Typography
                        variant='h6'
                        component='h1'
                        noWrap
                        sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
                    >
                        <Parkvue />
                        <ul className="navbar">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/map">Map</Link></li>
                            <li><Link to="/rewards">Rewards</Link></li>
                            <li><Link to="/about">About</Link></li>
                        </ul>
                        {/*<SignUp />*/}
                        <SignIn />
                    </Typography>
                </Toolbar>

                {/* Small screen view */}
                <Typography
                    variant='h6'
                    component='h1'
                    noWrap
                    sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                >
                    <P_Logo />
                    <Box sx={{ mr: 1 }}>
                        <IconButton size='large' color='inherit'>
                            <Menu />
                            {/*<SignUp />*/}
                            <SignIn />
                        </IconButton>

                    </Box>
                </Typography>
            </Container>
        </AppBar>
    )
}

export default NavBar;

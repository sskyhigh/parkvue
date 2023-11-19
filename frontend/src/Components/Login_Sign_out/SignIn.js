import React from 'react';
import '../NavBar/NavBar.css'; // Import your CSS file
import { Link } from 'react-router-dom';
import Register from "../../Pages/Register";


import{
    Button,
    AppBar,
    Box,
    IconButton,
} from '@mui/material';

import {Lock, Menu} from '@mui/icons-material';
import photoURL from '../../img/profile.jpeg';
import { useValue } from '../../context/ContextProvider';
import UserIcons from '../User/UserIcons';



const user = { name: 'test', photoURL };

const SignIn = () =>{
    const {state: {currentUser}, dispatch} = useValue();

        return (
            <AppBar>
                <Box sx={{ mr: 1 }}>
                    <IconButton size="large" color="inherit">
                        <Menu/>
                    </IconButton>
                </Box>
                {!currentUser ? (
                    <Button color="inherit" startIcon={<Lock />} onClick={()=> dispatch({type: 'UPDATE_USER', payload:user })}>
                        {/*<Link to="/login" style={{textDecoration: 'none', color: 'inherit'}}>*/}
                            Login
                        {/*</Link>*/}
                    </Button> ) : ( <UserIcons/>
                )}
            </AppBar>
        );
};

export default SignIn;
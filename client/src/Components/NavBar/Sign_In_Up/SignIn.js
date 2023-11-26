import React from 'react';
import '../NavBar.css'; // Import your CSS file
import { Link } from 'react-router-dom';


import{
    Button,
    Typography,
} from '@mui/material';

import {Lock} from '@mui/icons-material';
import photoURL from '../../../img/profile.jpeg';
import { useValue } from '../../../context/ContextProvider';
import UserIcons from '../../User/UserIcons';
import { Dialog } from '@mui/material';




const user = { name: 'test', photoURL };

const SignIn = () => {

    const {state: {currentUser},
        dispatch
    } = useValue();

        return (
            <Typography>
                {!currentUser ? (
                    <Button color="inherit" startIcon={<Lock />} //white lock
                        // dispatch action to update user state (inside the reducer file) 'UPDATE_USER'
                     onClick={()=> dispatch({type: 'UPDATE_USER', payload:user })}>
                        <Link to="/login">
                            Login
                        </Link>
                    </Button>) : (<UserIcons/>
                )}
            </Typography>
        );
};

export default SignIn;
import React from 'react';
import '../NavBar.css'; // Import your CSS file
// import { Link } from 'react-router-dom';

import{
    Button,
    Typography,
} from '@mui/material';

import {Lock} from '@mui/icons-material';
import { useValue } from '../../../context/ContextProvider';
import UserIcons from '../../user/UserIcons';

const SignIn = () => {

    const {state: {currentUser},
        dispatch
    } = useValue();

        return (
            <Typography>
                {!currentUser ? (
                    <Button color="inherit"
                            startIcon={<Lock />} //white lock
                        // dispatch action to update user state (inside the reducer file) 'UPDATE_USER'
                     onClick={()=> dispatch({type: 'OPEN_LOGIN' })}
                            sx={{ padding: '25px' }} //button distance from the top of the page
                    >
                        {/*<Link to="/login">*/}
                            Login
                        {/*</Link>*/}
                    </Button>) : (<UserIcons/>
                )}
            </Typography>
        );
};

export default SignIn;
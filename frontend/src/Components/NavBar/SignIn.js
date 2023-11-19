import React from 'react';
import '../NavBar/NavBar.css'; // Import your CSS file
import { Link } from 'react-router-dom';
// import Register from "../../Pages/Register";


import{
    Button,
    AppBar,
    IconButton,
} from '@mui/material';

import {Lock} from '@mui/icons-material';
import photoURL from '../../img/profile.jpeg';
import { useValue } from '../../context/ContextProvider';
import UserIcons from '../User/UserIcons';


//Testing: object for the user to login/out
const user = { name: 'test', photoURL };
//user object: depending on  the state in the context provider
const SignIn = () =>{
    //extract current user inside our state using the hook value
    const {
        state: {currentUser},
        dispatch
    } = useValue()
    //click out value is null when in initial state

        return (
            <div>
                {!currentUser ? ( //checks the state of the current user; if no current user; null; shows login button
                    <Button startIcon={<Lock />}
                        //dispatch the action to update user state insider reducer [update_user]; from null to user object created
                            onClick={()=> dispatch({type: 'UPDATE_USER', payload:user })}>
                        <Link to="/login">Login</Link>
                    </Button>) : ( //if current user available; icon will show

                    //icon
                    <UserIcons/>
                )}
            </div>
        );
};

export default SignIn;
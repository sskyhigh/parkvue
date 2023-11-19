import React from 'react';
import '../NavBar/NavBar.css'; // Import your CSS file
import {Link} from "react-router-dom";
import{Button} from '@mui/material';

function SignUp() {
    return (
        <div>
            <Button color="inherit" startIcon>
            <Link to="/register">Sign Up</Link>
            </Button>
        </div>
    );
}

export default SignUp;
import React from 'react';
import '../NavBar/NavBar.css'; // Import your CSS file
import {Link} from "react-router-dom";

function SignUp() {
    return (
        <div>
            <Link to="/register">Sign Up</Link>
        </div>
    );
}

export default SignUp;
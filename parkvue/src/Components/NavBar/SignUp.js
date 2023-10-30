import React from 'react';
import '../NavBar/NavBar.css'; // Import your CSS file
import {Link} from "react-router-dom";

function SignUp() {
  return (
  <div>
    <Link to="/register">Sign Up</Link>
    {/*<a href="/register" className="sign-in">Sign In</a>*/}
    </div>
    );
  }

export default SignUp;
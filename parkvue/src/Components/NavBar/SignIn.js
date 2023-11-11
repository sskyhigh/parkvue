import React from 'react';
import '../NavBar/NavBar.css'; // Import your CSS file
import { Link } from 'react-router-dom';
import Register from "../../Pages/Register";

function SignIn() {
  return (
    <div>
      <Link to="/login">Sign In</Link>
    </div>
  );
}

export default SignIn;
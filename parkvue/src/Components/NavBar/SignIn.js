import React from 'react';
import '../NavBar/NavBar.css'; // Import your CSS file
import { Link } from 'react-router-dom';
import Register from "../../Pages/Register";

function SignIn() {
  return (
    <div>
      <Link to="/register">Sign In</Link>
      {/* <a href="/register" className="sign-up">Sign Up</a> */}
    </div>
  );
}

export default SignIn;
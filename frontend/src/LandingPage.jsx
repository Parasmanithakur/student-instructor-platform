import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
const LandingPage = () => {

    return (
        <div>
            <h1>Welcome to the Student-Instructor Platform</h1>
            <p>Connect, learn, and grow together!</p>
              <Link to="/login"><button>Login</button></Link>
    <Link to="/signup"><button style={{ marginLeft: "10px" }}>Signup</button></Link>
  </div>
    );
};

export default LandingPage;
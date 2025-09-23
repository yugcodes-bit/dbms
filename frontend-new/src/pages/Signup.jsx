import React from 'react';
import './Login.css';
import img from "../assets/bluepantshirt.png"
import {Link} from 'react-router-dom'

const Signup = () => {
  return (
    <div className="split-screen-container">
      <div className="image-container">
        <img src={img} alt="Apparel" />
      </div>
      <div className="login-container">
        <div className="login-card">
          <h2>Sign-up</h2>
          <form>
            <div className="input-group">
              <input type="text" id="username" required />
              <label htmlFor="username">Username</label>
            </div>
            <div className="input-group">
              <input type="email" id="email" required />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-group">
              <input type="password" id="password" required />
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit" className="login-button">
              Sign-up
            </button>
          </form>
          <p className="signup-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

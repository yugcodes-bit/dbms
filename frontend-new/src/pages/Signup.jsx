import React, { useState } from 'react';
import './Login.css'; // Reusing the same styles
import img from "../assets/bluepantshirt.png";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import the Supabase client

const Signup = () => {
    const navigate = useNavigate();
    // Add state for each input field
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // This function will be called when the form is submitted
    const handleSignup = async (event) => {
        event.preventDefault(); // Prevent the page from refreshing

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                // We can add extra data like a username in the 'options' object
                options: {
                    data: {
                        username: username,
                    }
                }
            });

            if (error) throw error;
            
            // Show a success message and guide the user
            alert('Account created successfully! Please check your email for a verification link.');
            
            // Send the user to the login page after they sign up
            navigate('/login'); 

        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

    return (
        <div className="split-screen-container">
            <div className="image-container">
                <img src={img} alt="Apparel" />
            </div>
            <div className="login-container">
                <div className="login-card">
                    <h2>Sign-up</h2>
                    {/* Add the onSubmit handler to the form */}
                    <form onSubmit={handleSignup}>
                        <div className="input-group">
                            {/* Connect the input to the 'username' state */}
                            <input 
                                type="text" 
                                id="username" 
                                required 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className="input-group">
                            {/* Connect the input to the 'email' state */}
                            <input 
                                type="email" 
                                id="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="input-group">
                            {/* Connect the input to the 'password' state */}
                            <input 
                                type="password" 
                                id="password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
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
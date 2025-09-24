import React, { useState } from 'react';
import './Login.css';
import img from "../assets/bluepantshirt.png";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import the supabase client

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent the form from refreshing the page

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;
            
            alert('Logged in successfully!');
            // You can navigate to a dashboard or home page after login
            // navigate('/dashboard'); 

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
                    <h2>Login</h2>
                    {/* Use the handleLogin function on form submission */}
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            {/* Note: Supabase uses email for login by default */}
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
                            Login
                        </button>
                    </form>
                    <p className="signup-link">
                        Don't have an account? <Link to="/signup"> Signup</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
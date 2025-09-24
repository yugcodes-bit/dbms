import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Profile = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get current user session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email); // show email (or other metadata if stored)
      } else {
        navigate("/login"); // if not logged in, redirect
      }
    };

    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    } else {
      alert("Logged out successfully!");
      navigate("/login");
    }
  };

  return (
    <div className="profile-container">
      <h2>Welcome, {userEmail ? userEmail : "User"} </h2>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Profile;

import React from 'react';
import './taskbar.css';

const Taskbar = ({ isLoggedIn }) => {
  return (
    <header className="taskbar">
      <nav>
        <ul className="taskbar-nav">
          <li className="taskbar-item">
            <a href="/" className="taskbar-link">Home</a>
          </li>
          <li className="taskbar-item">
            <a href="/explore" className="taskbar-link">Explore</a>
          </li>
          <li className="taskbar-item">
            <a href="/measurement" className="taskbar-link">MeasureMe</a>
          </li>
          <li className="taskbar-item">
            {isLoggedIn ? (
              <a href="/profile" className="taskbar-link">My Profile</a>
            ) : (
              <a href="/login" className="taskbar-link">Login</a>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Taskbar;
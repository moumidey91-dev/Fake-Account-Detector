import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';

import { FiSearch } from 'react-icons/fi';

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="logo-icon">🛡️</span>
        <span className="logo-text">Fake<span className="logo-highlight">Shield</span></span>
      </div>

      <div className="nav-search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search profiles, URLs, or articles..." />
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-item">
          Home
        </Link>
        <Link to="/about" className="nav-item">
          About Us
        </Link>
        <Link to="/contact" className="nav-item">
          Contact Us
        </Link>
        
        <div className="auth-buttons">
          <button className="nav-btn signin-btn" onClick={() => setIsSignInOpen(true)}>Sign In</button>
          <button className="nav-btn signup-btn" onClick={() => setIsSignUpOpen(true)}>Sign Up</button>
        </div>

        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {isSignInOpen && (
        <SignInModal 
          onClose={() => setIsSignInOpen(false)} 
          onSwitchToSignUp={() => {
            setIsSignInOpen(false);
            setIsSignUpOpen(true);
          }}
        />
      )}
      {isSignUpOpen && (
        <SignUpModal 
          onClose={() => setIsSignUpOpen(false)} 
          onSwitchToSignIn={() => {
            setIsSignUpOpen(false);
            setIsSignInOpen(true);
          }}
        />
      )}
    </nav>
  );
}

export default Navbar;

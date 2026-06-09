import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import './SignInModal.css';

function SignInModal({ onClose, onSwitchToSignUp }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy login logic
    console.log("Login with", email, password);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX size={18} />
        </button>

        <div className="modal-header">
          <span className="logo-icon" style={{ fontSize: '1.8rem' }}>🛡️</span>
          <h2 className="logo-text" style={{ fontSize: '1.5rem', color: '#111', fontWeight: 'bold' }}>
            Fake<span className="logo-highlight" style={{ color: '#000' }}>Shield</span>
          </h2>
        </div>

        <button className="google-signin-btn">
          <div className="google-signin-info">
            <div className="user-avatar">
              <img src="https://ui-avatars.com/api/?name=Moumi+Dey&background=random" alt="Moumi Dey" />
            </div>
            <div className="user-details">
              <span className="user-name">Sign in as Moumi</span>
              <span className="user-email">moumidey2908@gmail.com</span>
            </div>
          </div>
          <FcGoogle className="google-icon" />
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group-modal">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="custom-input"
            />
          </div>

          <div className="password-row">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="custom-input"
            />
            <button 
              type="button" 
              className="toggle-password-btn" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <button type="submit" className="login-submit-btn">
            Log in
          </button>
        </form>

        <div className="modal-footer">
          <a href="#" className="forgot-password">Request a New Password</a>
          <p className="create-account">
            New here?{' '}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onSwitchToSignUp();
              }}
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default SignInModal;

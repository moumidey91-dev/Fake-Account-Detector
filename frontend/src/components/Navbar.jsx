import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

import { FiSearch } from 'react-icons/fi';

function Navbar() {
  const { theme, toggleTheme } = useTheme();

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
          <Link to="/signin" className="nav-btn signin-btn">Sign In</Link>
          <Link to="/signup" className="nav-btn signup-btn">Sign Up</Link>
        </div>

        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

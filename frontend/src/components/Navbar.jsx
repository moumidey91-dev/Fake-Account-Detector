import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="logo-icon">🛡️</span>
        <span className="logo-text">Fake<span className="logo-highlight">Shield</span></span>
      </div>
      <div className="nav-links">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <span className="nav-icon">🏠</span> Home
        </Link>
        <Link to="/detect" className={`nav-item ${location.pathname === '/detect' ? 'active' : ''}`}>
          <span className="nav-icon">🎯</span> Detect
        </Link>
        <Link to="#" className="nav-item">
          <span className="nav-icon">ℹ️</span> About
        </Link>
        <button className="theme-toggle" aria-label="Toggle Theme">
          🌙
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

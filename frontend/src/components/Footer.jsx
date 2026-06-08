import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        <div className="footer-brand-section">
          <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">Fake<span className="logo-highlight">Shield</span></span>
          </div>
          <p className="footer-tagline">Protecting digital authenticity with advanced Machine Learning and Real-time Analytics.</p>
          <div className="social-icons">
            <a href="#" className="social-icon" title="Twitter">🐦</a>
            <a href="#" className="social-icon" title="Facebook">📘</a>
            <a href="#" className="social-icon" title="LinkedIn">💼</a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Project</h4>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            <span>💻</span> GitHub Repository
          </a>
          <Link to="#team" className="footer-link">
            <span>👥</span> Team Members
          </Link>
        </div>

        <div className="footer-links-group">
          <h4>Support</h4>
          <Link to="#privacy" className="footer-link">
            <span>🔒</span> Privacy Policy
          </Link>
          <Link to="#contact" className="footer-link">
            <span>📧</span> Contact Us
          </Link>
        </div>

      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FakeShield. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

import { Link } from 'react-router-dom';
import shieldImage from '../assets/shield.png';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-content">
        <div className="badge">
          <span className="badge-icon">🛡️</span>
          <span>AI-Powered Protection</span>
        </div>
        
        <h1 className="hero-title">
          AI-Powered Fake<br/>Content <span className="highlight">Detection</span>
        </h1>
        
        <p className="hero-subtitle">
          Instantly detect fake news, misinformation, fraudulent accounts, and suspicious online profiles using state-of-the-art machine learning algorithms.
        </p>
        
        <div className="hero-actions">
          <Link to="/detect" className="btn-primary">
            <span className="btn-icon">⚙️</span> Analyze Now
          </Link>
          <button className="btn-secondary">
            Learn More <span className="arrow">→</span>
          </button>
        </div>
        
        <div className="hero-footer">
          POWERED BY XGBOOST & RANDOM FOREST
        </div>
      </div>
      
      <div className="hero-image-container">
        <img src={shieldImage} alt="AI Shield" className="hero-shield-img" />
      </div>
    </div>
  );
}

export default Home;

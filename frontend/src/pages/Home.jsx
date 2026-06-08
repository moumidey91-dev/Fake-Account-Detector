import { Link } from 'react-router-dom';
import shieldImage from '../assets/shield.png';

function Home() {
  return (
    <div className="page-wrapper">
      <div className="home-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Uncover the Truth with<br/><span className="highlight">FakeShield</span>
          </h1>
          
          <p className="hero-subtitle">
            Instantly detect fake news, misinformation, fraudulent accounts, and suspicious online profiles using state-of-the-art machine learning algorithms.
          </p>
          
          <div className="hero-actions">
            <Link to="/detect" className="btn-primary">
              <span className="btn-icon">⚙️</span> Check Now
            </Link>
          </div>

          <div className="project-description">
            <h3>About This Project</h3>
            <p>
              FakeShield is designed to combat the rising tide of digital misinformation and fraudulent social media accounts. By leveraging powerful machine learning models, we analyze account behaviors, engagement rates, and profile metadata to accurately determine the authenticity of a digital footprint.
            </p>
          </div>
        </div>
        
        <div className="hero-image-container">
          <img src={shieldImage} alt="AI Shield" className="hero-shield-img" />
          
          <div className="floating-badge badge-1">
            <span className="badge-icon">⚡</span>
            <div className="badge-text">
              <strong>96%+</strong>
              <span>Accuracy</span>
            </div>
          </div>

          <div className="floating-badge badge-2">
            <span className="badge-icon">🛡️</span>
            <div className="badge-text">
              <strong>Real-time</strong>
              <span>Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE CARDS SECTION */}
      <div className="features-grid-container">
        <h2 className="section-title">Why Choose FakeShield?</h2>
        <div className="four-cards-grid">
          <Link to="/news-detect" className="feature-card-small" style={{ textDecoration: 'none' }}>
            <div className="icon-circle">📰</div>
            <h4>Fake News Detection</h4>
            <p>Analyze articles and URLs to detect misinformation and bias using NLP.</p>
          </Link>
          <Link to="/detect" className="feature-card-small" style={{ textDecoration: 'none' }}>
            <div className="icon-circle">👤</div>
            <h4>Fake Profile Detection</h4>
            <p>Scan social media accounts to identify bots and fraudulent activity.</p>
          </Link>
          <div className="feature-card-small">
            <div className="icon-circle">🤖</div>
            <h4>AI-Powered Analysis</h4>
            <p>State-of-the-art machine learning models trained on millions of data points.</p>
          </div>
          <div className="feature-card-small">
            <div className="icon-circle">📈</div>
            <h4>Credibility Score</h4>
            <p>Get a clear, actionable authenticity score with detailed SHAP explanations.</p>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="workflow-container">
        <h2 className="section-title">How It Works</h2>
        <div className="workflow-timeline">
          <div className="timeline-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Input Content</h4>
              <p>Provide the news URL, article text, or social media profile details.</p>
            </div>
          </div>
          <div className="timeline-connector"></div>
          <div className="timeline-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Feature Extraction</h4>
              <p>Our engine automatically extracts key metadata and linguistic features.</p>
            </div>
          </div>
          <div className="timeline-connector"></div>
          <div className="timeline-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>ML Model Prediction</h4>
              <p>Advanced ensemble models (XGBoost, RF) process the features.</p>
            </div>
          </div>
          <div className="timeline-connector"></div>
          <div className="timeline-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Authenticity Report</h4>
              <p>Receive a comprehensive credibility score and risk assessment.</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODEL PERFORMANCE SECTION */}
      <div className="performance-container">
        <h2 className="section-title">Model Performance</h2>
        <p className="performance-subtitle">Our models are continuously trained to achieve industry-leading accuracy in detecting fake content.</p>
        
        <div className="performance-card">
          <div className="progress-bars-wrapper">
            <div className="progress-item">
              <div className="progress-info">
                <span className="model-name"><span className="model-icon">⚡</span> XGBoost Classifier</span>
                <span className="model-score" style={{ color: '#8b5cf6' }}>96%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '96%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-info">
                <span className="model-name"><span className="model-icon">🌲</span> Random Forest</span>
                <span className="model-score" style={{ color: '#10b981' }}>94%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '94%', background: 'linear-gradient(90deg, #10b981, #3b82f6)' }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-info">
                <span className="model-name"><span className="model-icon">📈</span> Logistic Regression</span>
                <span className="model-score" style={{ color: '#ef4444' }}>89%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '89%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;

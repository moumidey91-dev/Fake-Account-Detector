import { FiInfo, FiShield, FiTarget, FiUsers } from 'react-icons/fi';
import '../index.css'; // ensure global styles

function About() {
  return (
    <div className="page-wrapper" style={{ paddingTop: '2rem' }}>
      <div className="dashboard-wrapper">
        <div className="info-header" style={{ justifyContent: 'center', marginBottom: '3rem' }}>
          <div className="info-icon">
            <FiInfo />
          </div>
          <h1>About <span className="highlight">FakeShield</span></h1>
        </div>

        <div className="glass-panel" style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.8rem' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem' }}>
            In the age of rapid information spread, distinguishing truth from fabrication has become one of the greatest challenges of our digital era. <strong>FakeShield</strong> was created with a singular mission: to empower users with advanced AI-driven tools to automatically detect, analyze, and combat misinformation online. 
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
            We leverage state-of-the-art Machine Learning models including XGBoost, Random Forest, and Deep NLP Transformers to perform deep linguistic and structural analysis on articles, URLs, and social media posts, delivering instant probabilistic risk assessments.
          </p>
        </div>

        <div className="input-split-layout" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
          <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', color: '#3b82f6', marginBottom: '1rem' }}><FiTarget /></div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Precision</h3>
            <p style={{ color: 'var(--text-muted)' }}>We utilize ensembled models to achieve over 90% accuracy in detecting deceptive linguistic patterns.</p>
          </div>
          
          <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', color: '#10b981', marginBottom: '1rem' }}><FiShield /></div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Integrity</h3>
            <p style={{ color: 'var(--text-muted)' }}>We analyze domain trust, SSL verification, and source reputation to ensure unbiased authenticity checks.</p>
          </div>

          <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', color: '#a855f7', marginBottom: '1rem' }}><FiUsers /></div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Accessibility</h3>
            <p style={{ color: 'var(--text-muted)' }}>An easy-to-use platform built for journalists, students, and everyday internet users.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

import { useState } from 'react'

function Detect() {
  const [formData, setFormData] = useState({
    username: '',
    followers: '',
    following: '',
    posts: '',
    bio_length: '',
    profile_pic: '0',
    verified: '0',
    account_age: '',
    engagement_rate: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Ensure numerical inputs
      const payload = {
        username: formData.username,
        followers: Number(formData.followers) || 0,
        following: Number(formData.following) || 0,
        posts: Number(formData.posts) || 0,
        bio_length: Number(formData.bio_length) || 0,
        profile_pic: Number(formData.profile_pic),
        verified: Number(formData.verified),
        account_age: Number(formData.account_age) || 0,
        engagement_rate: parseFloat(formData.engagement_rate) || 0.0
      };

      const response = await fetch('http://localhost:5000/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Server error occurred');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-container">
      {/* Left Panel - Form */}
      <div className="form-panel">
        <h1>FakeShield AI</h1>
        <p className="subtitle">Advanced Machine Learning Account Verification</p>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="input-group full-width">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="e.g. bot_detect_99" />
          </div>

          <div className="input-group">
            <label>Followers</label>
            <input type="number" name="followers" value={formData.followers} onChange={handleChange} required min="0" placeholder="0" />
          </div>

          <div className="input-group">
            <label>Following</label>
            <input type="number" name="following" value={formData.following} onChange={handleChange} required min="0" placeholder="0" />
          </div>

          <div className="input-group">
            <label>Posts</label>
            <input type="number" name="posts" value={formData.posts} onChange={handleChange} required min="0" placeholder="0" />
          </div>

          <div className="input-group">
            <label>Bio Length (chars)</label>
            <input type="number" name="bio_length" value={formData.bio_length} onChange={handleChange} required min="0" placeholder="0" />
          </div>

          <div className="input-group">
            <label>Profile Picture</label>
            <select name="profile_pic" value={formData.profile_pic} onChange={handleChange}>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>

          <div className="input-group">
            <label>Verified Status</label>
            <select name="verified" value={formData.verified} onChange={handleChange}>
              <option value="1">Verified</option>
              <option value="0">Not Verified</option>
            </select>
          </div>

          <div className="input-group">
            <label>Account Age (days)</label>
            <input type="number" name="account_age" value={formData.account_age} onChange={handleChange} required min="0" placeholder="0" />
          </div>

          <div className="input-group">
            <label>Engagement Rate (%)</label>
            <input type="number" step="0.01" name="engagement_rate" value={formData.engagement_rate} onChange={handleChange} required min="0" placeholder="0.00" />
          </div>

          <div className="full-width">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Analyzing Profile...' : 'Run Verification Audit'}
            </button>
          </div>
        </form>
      </div>

      {/* Right Panel - Results */}
      <div className="results-panel">
        {loading ? (
          <div className="empty-state">
            <div className="loader"></div>
            <p>Running ML inference and generating SHAP explanations...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="status-badge status-fake">⚠️ Error</div>
            <p style={{color: 'var(--danger)'}}>{error}</p>
          </div>
        ) : result ? (
          <div className="results-content">
            <div className={`status-badge ${result.is_fake ? 'status-fake' : 'status-real'}`}>
              {result.prediction}
            </div>
            
            <div className="metrics-row">
              <div className="metric-card">
                <span className="metric-label">Confidence Score</span>
                <span className="metric-value">{result.confidence}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Risk Level</span>
                <span className="metric-value">{result.risk_level}</span>
              </div>
            </div>

            <h2>SHAP Feature Explanations</h2>
            <div className="explanation-list">
              {result.explanations.map((exp, idx) => (
                <div key={idx} className={`explanation-item exp-${exp.type}`}>
                  <div className="exp-title">{exp.title}</div>
                  <div className="exp-desc">{exp.desc}</div>
                </div>
              ))}
            </div>

            <div className="model-footer">
              Powered by: <strong>{result.model_used}</strong>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🛡️</div>
            <h2>Awaiting Input</h2>
            <p>Submit profile metrics to view the AI analysis.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Detect

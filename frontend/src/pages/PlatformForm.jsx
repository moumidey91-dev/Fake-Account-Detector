import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function PlatformForm() {
  const { platform } = useParams();
  const displayPlatform = platform.charAt(0).toUpperCase() + platform.slice(1);

  // Common State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Dynamic Form State
  const [formData, setFormData] = useState({
    username: '',
    profile_pic: '0',
    verified: '0',
    account_age: '',
    engagement_rate: '',
    // Instagram
    followers: '',
    following: '',
    posts: '',
    bio_length: '',
    // Facebook
    friends: '',
    public_posts: '',
    // LinkedIn
    connections: '',
    endorsements: '',
    experience_listed: '0'
  });

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
      // Data Mapping for Backend ML Model Compatibility
      // The Python ML model strictly expects: followers, following, posts, bio_length, profile_pic, verified, account_age, engagement_rate
      let payload = {
        username: formData.username,
        profile_pic: Number(formData.profile_pic),
        verified: Number(formData.verified),
        account_age: Number(formData.account_age) || 0,
        engagement_rate: parseFloat(formData.engagement_rate) || 0.0
      };

      if (platform === 'instagram') {
        payload.followers = Number(formData.followers) || 0;
        payload.following = Number(formData.following) || 0;
        payload.posts = Number(formData.posts) || 0;
        payload.bio_length = Number(formData.bio_length) || 0;
      } else if (platform === 'facebook') {
        // Map Facebook fields to ML expected fields
        payload.followers = Number(formData.friends) || 0;
        payload.following = 0; // Not applicable
        payload.posts = Number(formData.public_posts) || 0;
        payload.bio_length = 50; // Default dummy value
      } else if (platform === 'linkedin') {
        // Map LinkedIn fields to ML expected fields
        payload.followers = Number(formData.connections) || 0;
        payload.following = Number(formData.endorsements) || 0;
        payload.posts = Number(formData.experience_listed) === 1 ? 10 : 0;
        payload.bio_length = 100; // Default dummy value
      }

      const response = await fetch('http://localhost:5000/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Server error occurred');

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="detect-wrapper">
      <div className="glass-container">
        {/* Left Panel - Form */}
        <div className="form-panel">
          <Link to="/detect" className="back-link">← Back to Platforms</Link>
          <h1 style={{ marginTop: '1rem' }}>{displayPlatform} Analysis</h1>
          <p className="subtitle">Enter the specific criteria for this {displayPlatform} account.</p>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="input-group full-width">
              <label>Username / Profile Link</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder={`e.g. ${platform}_user`} />
            </div>

            {/* --- PLATFORM SPECIFIC FIELDS --- */}
            {platform === 'instagram' && (
              <>
                <div className="input-group"><label>Followers</label><input type="number" name="followers" value={formData.followers} onChange={handleChange} required min="0" placeholder="0" /></div>
                <div className="input-group"><label>Following</label><input type="number" name="following" value={formData.following} onChange={handleChange} required min="0" placeholder="0" /></div>
                <div className="input-group"><label>Posts</label><input type="number" name="posts" value={formData.posts} onChange={handleChange} required min="0" placeholder="0" /></div>
                <div className="input-group"><label>Bio Length (chars)</label><input type="number" name="bio_length" value={formData.bio_length} onChange={handleChange} required min="0" placeholder="0" /></div>
              </>
            )}

            {platform === 'facebook' && (
              <>
                <div className="input-group"><label>Friends Count</label><input type="number" name="friends" value={formData.friends} onChange={handleChange} required min="0" placeholder="0" /></div>
                <div className="input-group"><label>Public Posts</label><input type="number" name="public_posts" value={formData.public_posts} onChange={handleChange} required min="0" placeholder="0" /></div>
              </>
            )}

            {platform === 'linkedin' && (
              <>
                <div className="input-group"><label>Connections</label><input type="number" name="connections" value={formData.connections} onChange={handleChange} required min="0" placeholder="0" /></div>
                <div className="input-group"><label>Skills / Endorsements</label><input type="number" name="endorsements" value={formData.endorsements} onChange={handleChange} required min="0" placeholder="0" /></div>
                <div className="input-group">
                  <label>Experience Listed?</label>
                  <select name="experience_listed" value={formData.experience_listed} onChange={handleChange}>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </>
            )}

            {/* --- COMMON FIELDS --- */}
            <div className="input-group">
              <label>Profile Picture Uploaded?</label>
              <select name="profile_pic" value={formData.profile_pic} onChange={handleChange}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>

            <div className="input-group">
              <label>Verified Badge / Blue Tick</label>
              <select name="verified" value={formData.verified} onChange={handleChange}>
                <option value="1">Verified</option>
                <option value="0">Not Verified</option>
              </select>
            </div>

            <div className="input-group">
              <label>Account Age (Days active)</label>
              <input type="number" name="account_age" value={formData.account_age} onChange={handleChange} required min="0" placeholder="0" />
            </div>

            <div className="input-group">
              <label>Engagement Rate (%)</label>
              <input type="number" step="0.01" name="engagement_rate" value={formData.engagement_rate} onChange={handleChange} required min="0" placeholder="0.00" />
            </div>

            <div className="full-width">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Analyzing Profile...' : `Run ${displayPlatform} Audit`}
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel - Results */}
        <div className="results-panel">
          {loading ? (
            <div className="empty-state">
              <div className="loader"></div>
              <p>Running ML inference and generating explanations...</p>
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
              <p>Submit the {displayPlatform} profile metrics to view the AI analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlatformForm;

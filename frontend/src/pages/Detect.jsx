import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Detect() {
  const [screenshot, setScreenshot] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  return (
    <div className="detect-wrapper">
      <div className="glass-container" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
        <div className="form-panel">
          <h1>Analysis Setup</h1>
          <p className="subtitle">Select the platform to begin the verification audit.</p>

          <div className="platform-selection-grid">
            <Link to="/detect/facebook" className="platform-card">
              <div className="platform-icon-large fb-icon"><FaFacebook /></div>
              <h3>Facebook</h3>
              <p>Analyze friends, posts, and profile metadata</p>
            </Link>

            <Link to="/detect/instagram" className="platform-card">
              <div className="platform-icon-large ig-icon"><FaInstagram /></div>
              <h3>Instagram</h3>
              <p>Analyze followers, engagement, and bio</p>
            </Link>

            <Link to="/detect/linkedin" className="platform-card">
              <div className="platform-icon-large in-icon"><FaLinkedin /></div>
              <h3>LinkedIn</h3>
              <p>Analyze connections and professional experience</p>
            </Link>
          </div>
          
          {/* Optional Screenshot Upload kept here as requested, though usually better on the form page */}
          <div className="input-group full-width" style={{ marginTop: '3rem' }}>
            <label>Upload Account Screenshot (Optional Pre-scan)</label>
            <div className="upload-box">
              <input type="file" id="screenshot-upload" accept="image/*" onChange={handleFileChange} hidden />
              <label htmlFor="screenshot-upload" className="upload-label">
                <span className="upload-icon">📁</span>
                <span className="upload-text">
                  {screenshot ? screenshot.name : 'Click to upload screenshot before selecting platform'}
                </span>
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Detect;

import { FiMail, FiMapPin, FiMessageSquare, FiSend } from 'react-icons/fi';

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! Our team will get back to you shortly.");
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: '2rem' }}>
      <div className="dashboard-wrapper">
        <div className="info-header" style={{ justifyContent: 'center', marginBottom: '3rem' }}>
          <div className="info-icon" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.2))' }}>
            <FiMessageSquare color="#60a5fa" />
          </div>
          <h1>Contact <span style={{ color: '#60a5fa' }}>Us</span></h1>
        </div>

        <div className="input-split-layout">
          <div className="input-info-side">
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Get in Touch</h2>
            <p>
              Have questions about our AI models? Want to integrate FakeShield API into your platform? Or simply found a bug? We'd love to hear from you.
            </p>
            
            <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#a855f7' }}>
                  <FiMail />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '0.2rem' }}>Email Support</h4>
                  <p style={{ color: 'var(--text-muted)' }}>support@fakeshield.ai</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#ec4899' }}>
                  <FiMapPin />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '0.2rem' }}>Headquarters</h4>
                  <p style={{ color: 'var(--text-muted)' }}>Tech Park, Silicon Valley</p>
                </div>
              </div>
            </div>
          </div>

          <form className="detection-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="premium-input" placeholder="John Doe" required />
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="premium-input" placeholder="john@example.com" required />
            </div>
            
            <div className="form-group">
              <label>Message</label>
              <textarea 
                className="premium-input" 
                rows="5" 
                placeholder="How can we help you?" 
                required 
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>
            
            <button type="submit" className="analyze-btn" style={{ background: 'linear-gradient(135deg, #3b82f6, #a855f7)', boxShadow: '0 5px 20px rgba(59, 130, 246, 0.4)' }}>
              <FiSend className="btn-icon-svg" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;

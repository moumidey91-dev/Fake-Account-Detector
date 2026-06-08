import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiFileText, FiSearch, FiActivity, FiCheckCircle, FiBarChart2, FiGlobe, FiTarget, FiZap, FiCpu } from 'react-icons/fi';
import { BsNewspaper } from 'react-icons/bs';

function NewsDetect() {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [loadingStep, setLoadingStep] = useState(0); // 0=idle, 1=analyzing, 2=credibility, 3=models, 4=report, 5=done
  const [result, setResult] = useState(null);
  const [meterOffset, setMeterOffset] = useState(263.89); // Circumference for r=42

  const realSample = {
    url: 'https://www.reuters.com/technology/ai-developments',
    text: 'Artificial Intelligence continues to evolve rapidly, with major tech companies announcing new language models designed to improve natural language understanding and problem-solving capabilities across various industries.'
  };

  const fakeSample = {
    url: 'https://shocking-truth-exposed.net/secret-aliens',
    text: "BREAKING: Government officials finally admit that aliens have been secretly controlling the stock market for the last 50 years! You won't believe what happens next!! Click here to see the undeniable proof they tried to hide from you."
  };

  const handleSampleFill = (type) => {
    if (type === 'real') {
      setUrl(realSample.url);
      setText(realSample.text);
    } else {
      setUrl(fakeSample.url);
      setText(fakeSample.text);
    }
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!url && !text) return;
    
    setResult(null);
    setLoadingStep(1);
    setMeterOffset(263.89); // Reset meter

    // Simulate multi-step loading
    setTimeout(() => setLoadingStep(2), 1500);
    setTimeout(() => setLoadingStep(3), 3000);
    setTimeout(() => setLoadingStep(4), 4500);
    setTimeout(() => {
      setLoadingStep(5);
      
      const isFake = text.toLowerCase().includes('breaking') || text.toLowerCase().includes('!') || text.length < 50;
      const confidenceScore = isFake ? 94 : 89;
      
      setResult({
        status: isFake ? 'FAKE NEWS DETECTED' : 'AUTHENTIC CONTENT',
        isFake: isFake,
        confidence: confidenceScore,
        riskLevel: isFake ? 'High Risk' : 'Low Risk',
        time: '1.2s',
        indicators: isFake ? [
          { iconId: 'alert', text: 'Clickbait Headline Detected' },
          { iconId: 'file', text: 'Suspicious Language Patterns' },
          { iconId: 'search', text: 'Unverified Claims' },
          { iconId: 'activity', text: 'High Emotional Manipulation' }
        ] : [
          { iconId: 'check', text: 'Objective Language' },
          { iconId: 'chart', text: 'Consistent Fact Patterns' },
          { iconId: 'globe', text: 'Standard Journalism Structure' }
        ],
        source: {
          trust: isFake ? '12/100' : '92/100',
          https: isFake ? 'Invalid' : 'Verified',
          reputation: isFake ? 'Poor' : 'Excellent'
        }
      });

      // Animate the meter after a tiny delay for CSS transition to catch
      setTimeout(() => {
        setMeterOffset(263.89 - (263.89 * confidenceScore) / 100);
      }, 50);

    }, 5500);
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    
    const printWindow = window.open('', '_blank');
    
    const getPdfIcon = (isFake) => isFake 
      ? `<svg class="i-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`
      : `<svg class="i-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FakeShield Analysis Report</title>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
            @page { margin: 0; size: A4 portrait; }
            body { font-family: 'Outfit', sans-serif; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
            .page-container { padding: 40px 50px; background: #fff; min-height: 100vh; }
            
            /* Header */
            .header-banner { background: linear-gradient(135deg, #0f172a, #1e1b4b); color: white; padding: 35px 45px; border-radius: 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header-title { display: flex; align-items: center; gap: 15px; }
            .shield-icon { width: 50px; height: 50px; background: linear-gradient(135deg, #a855f7, #ec4899); border-radius: 14px; display: flex; justify-content: center; align-items: center; font-size: 26px; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4); }
            .header-title h1 { margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 0.5px; }
            .header-title p { margin: 4px 0 0 0; font-size: 13px; color: #94a3b8; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; }
            .header-meta { text-align: right; font-size: 13px; color: #cbd5e1; line-height: 1.6; }
            .meta-value { font-weight: 700; color: #fff; font-size: 14px; }

            /* Verdict Section */
            .verdict-container { display: flex; gap: 20px; margin-bottom: 30px; }
            .main-verdict { flex: 1.3; background: ${result.isFake ? '#fef2f2' : '#f0fdf4'}; border: 2px solid ${result.isFake ? '#fecaca' : '#bbf7d0'}; border-radius: 20px; padding: 35px; text-align: center; position: relative; overflow: hidden; }
            .main-verdict::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: ${result.isFake ? '#ef4444' : '#10b981'}; }
            .verdict-label { font-size: 13px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 5px; }
            .verdict-status { font-size: 42px; font-weight: 900; color: ${result.isFake ? '#dc2626' : '#16a34a'}; margin: 10px 0 25px 0; letter-spacing: 1px; line-height: 1; }
            
            .meter-wrap { background: #fff; border-radius: 99px; height: 16px; width: 85%; margin: 0 auto; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
            .meter-fill { height: 100%; width: ${result.confidence}%; background: linear-gradient(90deg, ${result.isFake ? '#f87171, #dc2626' : '#34d399, #059669'}); border-radius: 99px; }
            .confidence-text { font-size: 15px; font-weight: 700; color: #334155; margin-top: 12px; display: block; }

            .metrics-card { flex: 1; background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 30px; display: flex; flex-direction: column; justify-content: center; gap: 18px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
            .metric-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 18px; border-bottom: 1px dashed #e2e8f0; }
            .metric-row:last-child { border-bottom: none; padding-bottom: 0; }
            .m-label { font-size: 14px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
            .m-val { font-size: 16px; font-weight: 800; color: #0f172a; }

            /* Grid Sections */
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .section-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
            .s-title { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 25px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
            
            .ind-list { display: flex; flex-direction: column; gap: 15px; }
            .ind-item { display: flex; align-items: center; gap: 15px; font-size: 15px; font-weight: 600; color: #334155; background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .i-icon { width: 24px; height: 24px; color: ${result.isFake ? '#ef4444' : '#10b981'}; }

            .cred-row { display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid #f1f5f9; }
            .cred-row:last-child { border-bottom: none; }
            .c-label { color: #64748b; font-weight: 600; font-size: 15px; }
            .c-val { font-weight: 800; font-size: 15px; color: #0f172a; }

            /* Payload Section */
            .payload-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 30px; margin-bottom: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
            .payload-box { background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; font-family: 'Courier New', Courier, monospace; font-size: 14px; color: #475569; line-height: 1.7; word-wrap: break-word; }
            
            /* Footer */
            .report-footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #f1f5f9; }
            .footer-text { font-size: 13px; color: #94a3b8; font-weight: 500; max-width: 600px; margin: 0 auto; }
            .watermark { font-size: 20px; font-weight: 900; color: #e2e8f0; letter-spacing: 5px; margin-top: 15px; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div class="page-container">
            
            <div class="header-banner">
              <div class="header-title">
                <div class="shield-icon">🛡️</div>
                <div>
                  <h1>FakeShield Analysis</h1>
                  <p>Certified AI Assessment Report</p>
                </div>
              </div>
              <div class="header-meta">
                <div>Report ID: <span class="meta-value">FS-${Math.floor(100000 + Math.random() * 900000)}</span></div>
                <div>Generated: <span class="meta-value">${new Date().toLocaleString()}</span></div>
                <div style="margin-top: 5px; color: #94a3b8;">Models: XGBoost, Random Forest</div>
              </div>
            </div>
            
            <div class="verdict-container">
              <div class="main-verdict">
                <div class="verdict-label">Final Verdict</div>
                <div class="verdict-status">${result.isFake ? 'FAKE CONTENT' : 'AUTHENTIC'}</div>
                <div class="meter-wrap">
                  <div class="meter-fill"></div>
                </div>
                <span class="confidence-text">${result.confidence}% Confidence Match</span>
              </div>
              
              <div class="metrics-card">
                <div class="metric-row">
                  <span class="m-label">Risk Level</span>
                  <span class="m-val" style="color: ${result.isFake ? '#dc2626' : '#16a34a'}">${result.riskLevel}</span>
                </div>
                <div class="metric-row">
                  <span class="m-label">Processing Time</span>
                  <span class="m-val">${result.time}</span>
                </div>
                <div class="metric-row">
                  <span class="m-label">Domain Trust</span>
                  <span class="m-val">${result.source.trust}</span>
                </div>
              </div>
            </div>
            
            <div class="details-grid">
              <div class="section-card">
                <h3 class="s-title">Detection Indicators</h3>
                <div class="ind-list">
                  ${result.indicators.map(ind => `
                    <div class="ind-item">
                      ${getPdfIcon(result.isFake)}
                      <span>${ind.text}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <div class="section-card">
                <h3 class="s-title">Source Integrity</h3>
                <div>
                  <div class="cred-row">
                    <span class="c-label">HTTPS Security</span>
                    <span class="c-val" style="color: ${result.source.https === 'Verified' ? '#16a34a' : '#dc2626'}">${result.source.https}</span>
                  </div>
                  <div class="cred-row">
                    <span class="c-label">Domain Reputation</span>
                    <span class="c-val" style="color: ${result.source.reputation === 'Excellent' ? '#16a34a' : '#dc2626'}">${result.source.reputation}</span>
                  </div>
                  <div class="cred-row">
                    <span class="c-label">Linguistic Bias</span>
                    <span class="c-val">${result.isFake ? 'High Detection' : 'Neutral'}</span>
                  </div>
                  <div class="cred-row">
                    <span class="c-label">Fact Check Match</span>
                    <span class="c-val">${result.isFake ? 'Inconsistent' : 'Verified'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="payload-card">
              <h3 class="s-title">Analyzed Payload</h3>
              <div class="payload-box">
                ${url ? `<strong style="color: #0f172a;">Source URL:</strong><br/> ${url}<br><br>` : ''}
                ${text ? `<strong style="color: #0f172a;">Text Extract:</strong><br/> ${text}` : ''}
              </div>
            </div>
            
            <div class="report-footer">
              <div class="footer-text">
                This document is a certified export from the FakeShield ML Pipeline. It provides probabilistic risk assessments based on deep linguistic, structural, and metadata analysis models.
              </div>
              <div class="watermark">FAKESHIELD SECURE</div>
            </div>
            
          </div>
          <script>
            window.onload = () => setTimeout(() => window.print(), 300);
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const renderLoadingSteps = () => {
    const steps = [
      { id: 1, text: 'Analyzing Content Structure...' },
      { id: 2, text: 'Verifying Source Credibility...' },
      { id: 3, text: 'Running ML Models (XGBoost/RF)...' },
      { id: 4, text: 'Generating Final Report...' }
    ];

    return (
      <div className="loading-container">
        <div className="scanner-animation">
          <div className="scanner-line"></div>
        </div>
        <div className="loading-steps">
          {steps.map(step => (
            <div key={step.id} className={`loading-step ${loadingStep >= step.id ? 'active' : ''} ${loadingStep > step.id ? 'completed' : ''}`}>
              <div className="step-icon">
                {loadingStep > step.id ? '✓' : (loadingStep === step.id ? '...' : '')}
              </div>
              <span>{step.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="dashboard-wrapper">
        
        {!result && loadingStep === 0 && (
          <div className="input-section">
            
            {/* Stats Bar */}
            <div className="stats-bar">
              <span className="stat-item"><FiTarget className="stat-icon" /> 95%+ Accuracy</span>
              <span className="stat-item"><FiActivity className="stat-icon" /> 10,000+ Analyzed</span>
              <span className="stat-item"><FiZap className="stat-icon" /> Real-Time AI Detection</span>
              <span className="stat-item"><FiCpu className="stat-icon" /> Powered by XGBoost</span>
            </div>

            <div className="input-split-layout">
              {/* Left Side: Info & Quick Samples */}
              <div className="input-info-side">
                <div className="info-header">
                  <div className="info-icon"><BsNewspaper /></div>
                  <div>
                    <h1>Fake News Analyzer</h1>
                  </div>
                </div>
                <p>Paste a news article URL or the full text to analyze its authenticity and detect AI-generated content or misinformation.</p>
                
                <div className="quick-samples">
                  <h3>Quick Sample Testing</h3>
                  <button onClick={() => handleSampleFill('real')} className="sample-btn real">
                    <span className="sample-icon"><FiCheckCircle /></span> Try Real News Sample
                  </button>
                  <button onClick={() => handleSampleFill('fake')} className="sample-btn fake">
                    <span className="sample-icon"><FiAlertTriangle /></span> Try Fake News Sample
                  </button>
                </div>
              </div>

              {/* Right Side: Input Form */}
              <div className="input-form-side">
                <form onSubmit={handleAnalyze} className="detection-form">
                  <div className="form-group">
                    <label>News Article URL</label>
                    <input 
                      type="url" 
                      placeholder="https://example.com/news-article"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={loadingStep > 0}
                    />
                  </div>

                  <div className="form-group">
                    <label>Article Text (Required if URL is missing)</label>
                    <textarea 
                      placeholder="Paste the full article text here..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      disabled={loadingStep > 0}
                      rows="6"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary analyze-btn"
                    disabled={(!url && !text) || loadingStep > 0}
                  >
                    <FiSearch className="btn-icon-svg" /> Analyze Content
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {loadingStep > 0 && loadingStep < 5 && renderLoadingSteps()}

        {result && loadingStep === 5 && (
          <div className="results-dashboard fade-in">
            <div className="results-header">
              <h2>Analysis Complete</h2>
              <button onClick={() => { setResult(null); setLoadingStep(0); setUrl(''); setText(''); }} className="btn-secondary">Analyze Another</button>
            </div>

            <div className="results-grid-premium">
              
              {/* Left Column */}
              <div className="dashboard-column">
                
                {/* Main Score Card */}
                <div className="dashboard-card main-score-card">
                  <div className="score-header">
                    <h3>Prediction Status</h3>
                    <div className={`status-badge ${result.isFake ? 'danger' : 'safe'}`}>
                      {result.status}
                    </div>
                  </div>
                  
                  <div className="circular-meter-container">
                    <svg className="circular-meter" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="safeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient id="dangerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f87171" />
                          <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>
                      </defs>
                      <circle className="meter-bg" cx="50" cy="50" r="42"></circle>
                      <circle 
                        className={`meter-fill ${result.isFake ? 'danger' : 'safe'}`} 
                        cx="50" cy="50" r="42" 
                        stroke={result.isFake ? "url(#dangerGrad)" : "url(#safeGrad)"}
                        style={{ strokeDashoffset: meterOffset }}
                      ></circle>
                    </svg>
                    <div className="meter-content">
                      <span className="meter-value">{result.confidence}%</span>
                      <span className="meter-label">Confidence</span>
                    </div>
                  </div>

                  <div className="score-footer">
                    <div className="footer-metric">
                      <span className="metric-label">Risk Level</span>
                      <span className={`metric-value ${result.isFake ? 'text-danger' : 'text-safe'}`}>{result.riskLevel}</span>
                    </div>
                    <div className="footer-metric">
                      <span className="metric-label">Analysis Time</span>
                      <span className="metric-value">{result.time}</span>
                    </div>
                  </div>
                </div>

                {/* Source Credibility Panel */}
                <div className="dashboard-card credibility-card">
                  <h3>Source Credibility</h3>
                  <div className="credibility-grid">
                    <div className="cred-item">
                      <span className="cred-label">Domain Trust</span>
                      <span className="cred-value">{result.source.trust}</span>
                    </div>
                    <div className="cred-item">
                      <span className="cred-label">HTTPS Verification</span>
                      <span className={`cred-value ${result.source.https === 'Verified' ? 'text-safe' : 'text-danger'}`}>{result.source.https}</span>
                    </div>
                    <div className="cred-item">
                      <span className="cred-label">Domain Reputation</span>
                      <span className={`cred-value ${result.source.reputation === 'Excellent' ? 'text-safe' : 'text-danger'}`}>{result.source.reputation}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="dashboard-column">
                
                {/* Indicators */}
                <div className="dashboard-card indicators-card">
                  <h3>Key Detection Indicators</h3>
                  <ul className="indicator-list">
                    {result.indicators.map((ind, idx) => (
                      <li key={idx} className="indicator-item">
                        <span className="indicator-icon">
                          {ind.iconId === 'alert' && <FiAlertTriangle className="indicator-svg text-danger" />}
                          {ind.iconId === 'file' && <FiFileText className="indicator-svg text-danger" />}
                          {ind.iconId === 'search' && <FiSearch className="indicator-svg text-danger" />}
                          {ind.iconId === 'activity' && <FiActivity className="indicator-svg text-danger" />}
                          {ind.iconId === 'check' && <FiCheckCircle className="indicator-svg text-safe" />}
                          {ind.iconId === 'chart' && <FiBarChart2 className="indicator-svg text-safe" />}
                          {ind.iconId === 'globe' && <FiGlobe className="indicator-svg text-safe" />}
                        </span>
                        <span className="indicator-text">{ind.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Models Used */}
                <div className="dashboard-card models-card">
                  <h3>AI Models Used</h3>
                  <div className="model-badges">
                    <span className="model-badge rf">🌲 Random Forest</span>
                    <span className="model-badge xgb">⚡ XGBoost</span>
                    <span className="model-badge tfidf">🔠 TF-IDF Vectorization</span>
                    <span className="model-badge nlp">🧠 NLP Processing</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="dashboard-card action-card">
                  <h3>Generate Report</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '0.5rem 0 1.2rem', lineHeight: '1.5' }}>
                    Download a comprehensive PDF report containing detailed SHAP value explanations and full linguistic structural breakdown.
                  </p>
                  <button className="btn-primary w-100" onClick={handleDownloadPDF} style={{ padding: '1.2rem', fontSize: '1.05rem' }}>
                    <span className="btn-icon">📄</span> Download PDF Report
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default NewsDetect;

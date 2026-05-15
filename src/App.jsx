import React, { useState } from 'react';
import jsPDF from 'jspdf';
import './index.css';

export default function App() {
  const [page, setPage] = useState('home'); // home, crafter
  const [jobDesc, setJobDesc] = useState('');
  const [resume, setResume] = useState('');
  const [vibe, setVibe] = useState('wise');
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateLetter = async () => {
    setError('');
    if (!jobDesc.trim() || !resume.trim()) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    
    const prompt = `You are Ellis, an AI job coach. Write a 150-200 word cover letter for this job:

Job: ${jobDesc}

Resume: ${resume}

Vibe: ${vibe}

Write only the letter, no preamble.`;

    try {
      const response = await fetch('/.netlify/functions/generate-letter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    jobDesc,
    resume,
    vibe
  })
});

if (!response.ok) {
  throw new Error(`API error: ${response.status}`);
}

const data = await response.json();
      setLetter(data.content[0].text);
    } catch (err) {
      setError('Error: ' + err.message);
    }

    setLoading(false);
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(10);
    pdf.text(letter, 10, 10, { maxWidth: 190 });
    pdf.save('cover-letter.pdf');
  };

  // HOME PAGE
  if (page === 'home') {
    return (
      <div className="app-container">
        <header className="header">
          <div className="logo">☕ Ellis</div>
          <div className="tagline">Your AI Career Coach</div>
        </header>

        <div className="home-content">
          <h1>Meet Ellis</h1>
          <p>Translate decades of experience into modern cover letters.</p>

          <div className="home-grid">
            <div className="home-card">
              <h2>Cover Letter Crafter</h2>
              <p>Free. Fast. No BS.</p>
              <button 
                onClick={() => setPage('crafter')}
                className="btn btn-primary"
              >
                Try It Free →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CRAFTER PAGE
  return (
    <div className="app-container">
      <header className="header">
        <button 
          onClick={() => setPage('home')}
          className="back-btn"
        >
          ← Back
        </button>
        <div className="logo">☕ Ellis Cover Letter Crafter</div>
      </header>

      <div className="crafter-content">
        <h2>Turn "Vintage" Into "Valuable"</h2>

        <div className="input-group">
          <label>📋 Job Description</label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job posting here..."
            rows={5}
          />
        </div>

        <div className="input-group">
          <label>📄 Your Resume or Experience</label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume or experience here..."
            rows={5}
          />
        </div>

        <div className="input-group">
          <label>🎯 Choose Your Vibe</label>
          <div className="vibe-buttons">
            {['wise', 'soft', 'bold', 'classic'].map(v => (
              <button
                key={v}
                className={`vibe-btn ${vibe === v ? 'active' : ''}`}
                onClick={() => setVibe(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          onClick={generateLetter}
          disabled={loading}
          className="btn btn-primary btn-large"
        >
          {loading ? 'Generating...' : 'Generate Cover Letter'}
        </button>

        {letter && (
          <div className="output-section">
            <h3>Your Cover Letter</h3>
            <div className="letter-preview">{letter}</div>
            <button
              onClick={downloadPDF}
              className="btn btn-success"
            >
              ⬇️ Download as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
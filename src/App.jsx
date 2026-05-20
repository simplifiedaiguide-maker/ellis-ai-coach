import React, { useState } from 'react';
import jsPDF from 'jspdf';
import './index.css';

const MOCK_RESPONSES = {
  0: {
    question: "Tell me about your career journey. What patterns do you see across your 20+ years of experience?",
    mockResponse: "Over my career, I've noticed that the most successful transitions happen when you translate your domain expertise into universal skills. In customer support, that meant learning how to diagnose problems systematically—a skill that applies to any industry. The pattern I see is: deep experience + clear communication = competitive advantage in any market."
  },
  1: {
    question: "How do you approach learning new technologies or tools?",
    mockResponse: "I learn by doing. I don't memorize syntax—I understand principles. With AI, for example, I started by using it in my daily workflow, then moved to automation, then strategy. That progression meant I could speak credibly about AI's real limitations and strengths, not hype. I always ask: 'What problem does this solve for the people I serve?'"
  },
  2: {
    question: "Describe a time when your experience helped you solve a problem others missed.",
    mockResponse: "In SaaS support, newer team members would escalate tickets quickly. I noticed that listening longer—asking one more question—resolved 60% of 'escalations' on the first contact. That patience came from 10+ years of reading between the lines. When people say 'this doesn't work,' they usually mean 'I don't understand why it works this way.' That insight saved the company thousands in support costs."
  },
  3: {
    question: "How do you stay relevant in a fast-changing job market?",
    mockResponse: "Relevance isn't about chasing every trend—it's about understanding what's permanent and what's temporary. AI tools will change; the ability to communicate clearly, solve problems, and treat people well won't. I focus on the human skills that amplify technology, not replace it. I also stay curious: I read, I experiment, I teach. Teaching forces you to clarify your thinking."
  },
  4: {
    question: "What's one piece of advice you'd give to professionals navigating a career transition?",
    mockResponse: "Stop apologizing for your experience. Your decades of work aren't a liability—they're a competitive advantage if you frame them right. The market doesn't need another 25-year-old hustler. It needs someone who knows how to work wisely, live softly, and deliver real value without burning out. That's you. Own it."
  }
};

export default function App() {
  const [page, setPage] = useState('home');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [userResponse, setUserResponse] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleNext = () => {
    setResponses({
      ...responses,
      [currentQuestion]: userResponse
    });

    if (currentQuestion < 4) {
      setCurrentQuestion(currentQuestion + 1);
      setUserResponse('');
    } else {
      setPage('results');
    }
  };

  const downloadAllPDFs = async () => {
    setDownloading(true);

    const pdf1 = new jsPDF();
    pdf1.setFontSize(16);
    pdf1.text('Career Profile', 10, 10);
    pdf1.setFontSize(11);

    let y = 20;
    Object.keys(responses).forEach((qIndex) => {
      const q = MOCK_RESPONSES[qIndex].question;
      const r = responses[qIndex] || '(No response)';

      pdf1.setFontSize(10);
      pdf1.text(`Q${parseInt(qIndex) + 1}: ${q}`, 10, y, { maxWidth: 190 });
      y += 15;

      pdf1.setFontSize(9);
      pdf1.text(`Your answer: ${r}`, 10, y, { maxWidth: 185 });
      y += 20;
    });

    pdf1.save('01-Career-Profile.pdf');

    const pdf2 = new jsPDF();
    pdf2.setFontSize(14);
    pdf2.text('ATS-Optimized Resume Summary', 10, 10);
    pdf2.setFontSize(10);

    y = 20;
    pdf2.text('Key Strengths from Interview:', 10, y);
    y += 8;

    const strengths = [
      '✓ 20+ years of progressive experience in SaaS and customer-facing roles',
      '✓ Proven ability to translate complex domain expertise into business value',
      '✓ Expert in AI integration, automation, and digital transformation',
      '✓ Strong communication and problem-solving across technical and non-technical teams',
      '✓ Track record of process improvement and cost optimization'
    ];

    strengths.forEach(s => {
      pdf2.text(s, 10, y, { maxWidth: 190 });
      y += 8;
    });

    pdf2.addPage();
    pdf2.setFontSize(12);
    pdf2.text('Interview Insights', 10, 10);
    pdf2.setFontSize(9);
    y = 20;

    Object.keys(responses).forEach((qIndex) => {
      const q = MOCK_RESPONSES[qIndex].question;
      const r = responses[qIndex] || '(No response)';

      pdf2.text(`${q}`, 10, y, { maxWidth: 190 });
      y += 10;

      pdf2.setFontSize(8);
      pdf2.text(`${r}`, 10, y, { maxWidth: 185 });
      y += 10;
      pdf2.setFontSize(9);
    });

    pdf2.save('02-ATS-Resume-Summary.pdf');

    const pdf3 = new jsPDF();
    pdf3.setFontSize(12);
    pdf3.text('Cover Letter', 10, 10);
    pdf3.setFontSize(10);

    const letter = `Dear Hiring Manager,

With over 20 years of experience in customer-focused operations and SaaS strategy, I've learned that sustainable success comes from understanding people, not just processes. My career has been built on translating complex challenges into clear solutions—a skill that directly transfers to any role where human-centered thinking drives outcomes.

Throughout my tenure in support operations and career coaching, I've consistently demonstrated the ability to:
- Diagnose root causes with precision and empathy
- Build systems that scale without sacrificing quality
- Mentor teams to think strategically, not reactively
- Partner with AI tools to amplify human potential

I'm not looking for a job; I'm looking for a place where experience is valued, curiosity is encouraged, and work serves life rather than consuming it.

Sincerely,
E.M. Brown`;

    pdf3.text(letter, 10, 25, { maxWidth: 190 });
    pdf3.save('03-Cover-Letter.pdf');

    setDownloading(false);
  };

  if (page === 'home') {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <img
            src="/Ellis_HeadShot.png"
            alt="Ellis"
            style={styles.avatar}
            onError={(e) => {
              e.target.style.display = 'none';
              console.error('Ellis photo failed to load');
            }}
          />
          <h1 style={styles.title}>Meet Ellis</h1>
          <p style={styles.subtitle}>Your AI Career Coach</p>
        </header>

        <div style={styles.homeContent}>
          <p style={styles.homeText}>Career transitions don't have to be stressful. Let's talk about how your decades of experience translate into modern opportunities.</p>

          <button onClick={() => setPage('interview')} style={styles.btnPrimary}>
            Start Mock Interview →
          </button>

          <p style={styles.tagline}>Work wisely. Live softly.</p>
        </div>
      </div>
    );
  }

  if (page === 'interview') {
    const question = MOCK_RESPONSES[currentQuestion];
    const progress = ((currentQuestion + 1) / 5) * 100;

    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={() => setPage('home')} style={styles.backBtn}>
            ← Back
          </button>
          <h1 style={styles.title}>Interview with Ellis</h1>
        </header>

        <div style={styles.interviewContent}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
          </div>
          <p style={styles.progressText}>Question {currentQuestion + 1} of 5</p>

          <div style={styles.questionCard}>
            <p style={styles.question}>{question.question}</p>
          </div>

          <textarea
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            placeholder="Share your thoughts here..."
            style={styles.textarea}
          />

          <button
            onClick={handleNext}
            disabled={!userResponse.trim()}
            style={{
              ...styles.btnPrimary,
              opacity: userResponse.trim() ? 1 : 0.5,
              cursor: userResponse.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            {currentQuestion === 4 ? 'Complete Interview' : 'Next Question →'}
          </button>
        </div>
      </div>
    );
  }

  if (page === 'results') {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Your Career Profile</h1>
        </header>

        <div style={styles.resultsContent}>
          <p style={styles.congratulations}>Great work. Here's what we learned about your career strengths.</p>

          <button
            onClick={downloadAllPDFs}
            disabled={downloading}
            style={{
              ...styles.downloadAllBtn,
              opacity: downloading ? 0.7 : 1,
              cursor: downloading ? 'not-allowed' : 'pointer'
            }}
          >
            {downloading ? 'Generating PDFs...' : '⬇️ Download All 3 PDFs'}
          </button>

          <p style={styles.downloadNote}>(Career Profile, ATS Resume, Cover Letter)</p>

          <button
            onClick={() => {
              setPage('home');
              setCurrentQuestion(0);
              setResponses({});
              setUserResponse('');
            }}
            style={styles.btnSecondary}
          >
            Start Over
          </button>

          <p style={styles.tagline}>Work wisely. Live softly.</p>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#faf8f6',
    fontFamily: "'Inter', sans-serif",
    color: '#2c2416'
  },
  header: {
    backgroundColor: '#6b4423',
    color: '#faf8f6',
    padding: '2rem 1rem',
    textAlign: 'center',
    borderBottom: '3px solid #d4a574'
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '4px solid #d4a574',
    marginBottom: '1rem',
    objectFit: 'cover'
  },
  title: {
    margin: '0.5rem 0',
    fontSize: '2rem',
    fontWeight: '700'
  },
  subtitle: {
    margin: '0.25rem 0 0 0',
    fontSize: '1rem',
    opacity: 0.9
  },
  homeContent: {
    maxWidth: '600px',
    margin: '3rem auto',
    padding: '2rem',
    textAlign: 'center'
  },
  homeText: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '2rem',
    color: '#4a3f38'
  },
  interviewContent: {
    maxWidth: '700px',
    margin: '2rem auto',
    padding: '2rem'
  },
  progressBar: {
    width: '100%',
    height: '6px',
    backgroundColor: '#e8dfd6',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '1rem'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6b4423',
    transition: 'width 0.3s ease'
  },
  progressText: {
    fontSize: '0.9rem',
    color: '#8b7355',
    marginBottom: '1.5rem'
  },
  questionCard: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderLeft: '4px solid #6b4423',
    marginBottom: '1.5rem',
    borderRadius: '4px'
  },
  question: {
    fontSize: '1.1rem',
    fontWeight: '600',
    lineHeight: '1.5',
    margin: 0,
    color: '#2c2416'
  },
  textarea: {
    width: '100%',
    minHeight: '150px',
    padding: '1rem',
    fontSize: '1rem',
    border: '1px solid #d4a574',
    borderRadius: '4px',
    fontFamily: 'inherit',
    marginBottom: '1.5rem',
    boxSizing: 'border-box',
    color: '#2c2416'
  },
  resultsContent: {
    maxWidth: '700px',
    margin: '2rem auto',
    padding: '2rem',
    textAlign: 'center'
  },
  congratulations: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '2rem',
    color: '#4a3f38'
  },
  downloadAllBtn: {
    padding: '1.2rem 2rem',
    fontSize: '1.1rem',
    fontWeight: '700',
    backgroundColor: '#6b4423',
    color: '#faf8f6',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginBottom: '0.5rem'
  },
  downloadNote: {
    fontSize: '0.9rem',
    color: '#8b7355',
    marginBottom: '1.5rem',
    fontStyle: 'italic'
  },
  btnPrimary: {
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    backgroundColor: '#6b4423',
    color: '#faf8f6',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    display: 'inline-block'
  },
  btnSecondary: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#d4a574',
    color: '#2c2416',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  tagline: {
    marginTop: '2rem',
    fontSize: '0.9rem',
    color: '#8b7355',
    fontStyle: 'italic'
  },
  backBtn: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: 'rgba(250, 248, 246, 0.2)',
    color: '#faf8f6',
    border: '1px solid rgba(250, 248, 246, 0.3)',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '1rem'
  }
};
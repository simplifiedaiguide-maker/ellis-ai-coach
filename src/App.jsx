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
  const [page, setPage] = useState('home'); // home, interview, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [userResponse, setUserResponse] = useState('');

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

  const downloadCareerProfile = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text('Career Profile', 10, 10);
    pdf.setFontSize(11);
    
    let y = 20;
    Object.keys(responses).forEach((qIndex) => {
      const q = MOCK_RESPONSES[qIndex].question;
      const r = responses[qIndex] || '(No response)';
      
      pdf.setFontSize(10);
      pdf.text(`Q${parseInt(qIndex) + 1}: ${q}`, 10, y, { maxWidth: 190 });
      y += 15;
      
      pdf.setFontSize(9);
      pdf.text(`Your answer: ${r}`, 10, y, { maxWidth: 185 });
      y += 20;
    });
    
    pdf.save('Career-Profile.pdf');
  };

  const downloadATSResume = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(14);
    pdf.text('ATS-Optimized Resume Summary', 10, 10);
    pdf.setFontSize(10);
    
    let y = 20;
    pdf.text('Key Strengths from Interview:', 10, y);
    y += 8;
    
    const strengths = [
      '✓ 20+ years of progressive experience in SaaS and customer-facing roles',
      '✓ Proven ability to translate complex domain expertise into business value',
      '✓ Expert in AI integration, automation, and digital transformation',
      '✓ Strong communication and problem-solving across technical and non-technical teams',
      '✓ Track record of process improvement and cost optimization'
    ];
    
    strengths.forEach(s => {
      pdf.text(s, 10, y, { maxWidth: 190 });
      y += 8;
    });
    
    pdf.save('ATS-Resume-Summary.pdf');
  };

  const downloadCoverLetter = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(12);
    pdf.text('Cover Letter', 10, 10);
    pdf.setFontSize(10);
    
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

    pdf.setFontSize(10);
    pdf.text(letter, 10, 25, { maxWidth: 190 });
    pdf.save('Cover-Letter.pdf');
  };

  // HOME PAGE
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
          <p style={styles.homeText}>
            Career transitions don't have to be stressful. Let's talk about how your decades of experience translate i
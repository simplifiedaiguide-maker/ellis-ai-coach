import React, { useState } from 'react';
import { SessionData } from '../../../types/session';
import { generatePDF } from '../../../utils/pdf';
import { subscribeToMailerLite } from '../../../utils/mailerlite';
import { Button } from '../shared/Button';
import { TextInput } from '../shared/TextInput';
import { ProgressBar } from '../shared/ProgressBar';
import './ResultScreen.css';

interface ResultScreenProps {
  sessionData: SessionData;
  onContinue: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  sessionData,
  onContinue,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getResultContent = () => {
    const { path, snapshot } = sessionData;

    if (path === 'mock-interview') {
      return {
        title: "Here's your first move.",
        subtitle: `Based on what you told me about ${snapshot.currentRole} → ${snapshot.targetRole}:`,
        resultText: (
          <>
            <p>
              <strong>Your first step:</strong> Record a 2-minute answer to this
              question, then listen back. I'll give you feedback on clarity,
              confidence, and how you're positioning your experience.
            </p>
            <blockquote className="question">
              "Walk me through a time you had to learn something completely new on
              the job. How did you approach it?"
            </blockquote>
            <p className="explanation">
              This question is designed to address the 'can you still learn?'
              concern that comes up in interviews with experienced professionals.
              Your answer proves you're curious, not stuck.
            </p>
          </>
        ),
      };
    }

    if (path === 'resume') {
      return {
        title: "Here's your ATS-friendly rewrite.",
        subtitle: `For ${snapshot.targetRole}:`,
        resultText: (
          <>
            <p><strong>Before:</strong></p>
            <p className="before-example">
              "Experienced {snapshot.currentRole} with {snapshot.yearsOfExperience}{' '}
              managing relationships and driving growth."
            </p>
            <p><strong>After (paste this into your resume):</strong></p>
            <p className="after-example">
              "Led complex client relationships and strategic initiatives across{' '}
              {snapshot.yearsOfExperience}. Known for translating ambiguous requests
              into clear action plans. Now bringing that clarity to {snapshot.targetRole}."
            </p>
            <p className="explanation">
              Notice: Numbers replace adjectives. "Solved" replaces "did." Age
              markers are gone. You sound like judgment, not experience for its own sake.
            </p>
          </>
        ),
      };
    }

    return {
      title: "Here's your strategy brief.",
      subtitle: `Your next steps toward ${snapshot.targetRole}:`,
      resultText: (
        <p>
          You've identified your main challenge. Ellis has prepared custom guidance
          based on your situation. Export your brief and use it as your north star
          for the next 30 days.
        </p>
      ),
    };
  };

  const handleExportPDF = async () => {
    try {
      await generatePDF(sessionData);
    } catch (err) {
      console.error('PDF export failed:', err);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleContinue = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await subscribeToMailerLite({
        email: email.trim(),
        name: '',
        sessionData: sessionData,
      });

      setSuccess(true);
      setTimeout(() => {
        onContinue();
      }, 2000);
    } catch (err) {
      console.error('Subscription failed:', err);
      setError('We had trouble subscribing you. Please try again or email hello@rebrandrise.com.');
      setIsLoading(false);
    }
  };

  const content = getResultContent();

  return (
    <div className="screen result-screen">
      <div className="screen-content">
        <h2>{content.title}</h2>
        <p className="subtext">{content.subtitle}</p>

        <div className="result-box">
          {content.resultText}
        </div>

        {!success && (
          <>
            <p className="follow-up">
              After you try this, come back and we'll build out your full interview
              prep, resume strategy, or LinkedIn refresh. Your choice.
            </p>

            <div className="email-section">
              <h3>Stay connected with Ellis</h3>
              <p className="email-hint">
                Get more tips, session results, and updates delivered to your inbox.
              </p>

              <TextInput
                label="Your email"
                placeholder="you@example.com"
                value={email}
                onChange={setEmail}
                type="email"
              />

              {error && <p className="error-message">{error}</p>}
            </div>
          </>
        )}

        {success && (
          <div className="success-message">
            <p>
              <strong>✓ You're in!</strong> Check your email for your results and
              next steps. Welcome to Ellis.
            </p>
          </div>
        )}
      </div>

      <div className="screen-actions">
        <Button onClick={handleExportPDF} variant="primary">
          Export as PDF
        </Button>

        {!success && (
          <Button
            onClick={handleContinue}
            variant="secondary"
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? 'Subscribing...' : 'Continue with Ellis'}
          </Button>
        )}

        {success && (
          <Button onClick={onContinue} variant="secondary">
            Next
          </Button>
        )}
      </div>

      <ProgressBar current={5} />
    </div>
  );
};

import React from 'react';
import { Button } from '../shared/Button';
import './WelcomeScreen.css';

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <div className="screen welcome-screen">
      <div className="screen-content">
        <div className="tag">Welcome to Ellis</div>
        <h1>Your decades of experience aren't outdated. Let's prove it.</h1>
        <p className="subheading">
          I'm Ellis. I help professionals like you translate 20+ years of wisdom
          into a language hiring managers actually listen to—and help you answer
          the tough questions that come your way.
        </p>
      </div>
      <div className="screen-actions">
        <Button onClick={onNext} variant="primary">
          Let's start
        </Button>
        <p className="reassurance">
          Takes about 3 minutes. You'll walk away with something useful, no credit
          card needed.
        </p>
      </div>
    </div>
  );
};

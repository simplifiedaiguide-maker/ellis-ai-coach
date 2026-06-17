import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  current: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current }) => {
  const percentage = (current / 5) * 100;
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      <p className="progress-text">Step {current} of 5</p>
    </div>
  );
};

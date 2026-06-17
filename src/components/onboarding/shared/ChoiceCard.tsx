import React from 'react';
import './ChoiceCard.css';

interface ChoiceCardProps {
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({
  title,
  description,
  isActive,
  onClick,
}) => {
  return (
    <div
      className={`choice-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <strong>{title}</strong>
      <p className="description">{description}</p>
    </div>
  );
};

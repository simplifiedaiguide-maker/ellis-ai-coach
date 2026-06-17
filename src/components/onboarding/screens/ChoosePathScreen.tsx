import React from 'react';
import { ChoiceCard } from '../shared/ChoiceCard';
import { ProgressBar } from '../shared/ProgressBar';
import { Button } from '../shared/Button';
import { SessionPath } from '../../../types/session';
import './ChoosePathScreen.css';

interface ChoosePathScreenProps {
  selectedPath: SessionPath | null;
  onPathSelect: (path: SessionPath) => void;
  onNext: () => void;
}

const pathOptions: { id: SessionPath; title: string; description: string }[] = [
  {
    id: 'mock-interview',
    title: 'Mock Interview',
    description: "Practice the questions that trip you up. I'll help you address age bias, the \"overqualified\" objection, and career gaps head-on.",
  },
  {
    id: 'resume',
    title: 'Resume Translator',
    description: "Turn your 20 years into an ATS-friendly story. No buzzwords. Just clarity that gets past the bots.",
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Profile Review',
    description: "Make your headline, summary, and experience section work for you. Get visibility without sounding desperate.",
  },
  {
    id: 'strategy',
    title: 'Career Clarity',
    description: "Stuck on next moves, salary, or how to position yourself? Let's talk through it and build a plan.",
  },
];

export const ChoosePathScreen: React.FC<ChoosePathScreenProps> = ({
  selectedPath,
  onPathSelect,
  onNext,
}) => {
  return (
    <div className="screen">
      <div className="screen-content">
        <h2>What's holding you back right now?</h2>
        <p className="subtext">
          Pick one. We'll focus on it, and you'll get concrete next steps at the end.
        </p>
        <div className="choices">
          {pathOptions.map((option) => (
            <ChoiceCard
              key={option.id}
              title={option.title}
              description={option.description}
              isActive={selectedPath === option.id}
              onClick={() => onPathSelect(option.id)}
            />
          ))}
        </div>
      </div>
      <div className="screen-actions">
        <Button onClick={onNext} variant="primary" disabled={!selectedPath}>
          Next
        </Button>
      </div>
      <ProgressBar current={2} />
    </div>
  );
};

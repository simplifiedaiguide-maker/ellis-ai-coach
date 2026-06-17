import React from 'react';
import { ChoiceCard } from '../shared/ChoiceCard';
import { ProgressBar } from '../shared/ProgressBar';
import { Button } from '../shared/Button';
import { BlockerType } from '../../../types/session';
import './BlockerScreen.css';

interface BlockerScreenProps {
  selectedBlocker: BlockerType | null;
  onBlockerSelect: (blocker: BlockerType) => void;
  onNext: () => void;
}

const blockerOptions: { id: BlockerType; title: string; description: string }[] = [
  {
    id: 'ats-filtering',
    title: "I think ATS is filtering me out.",
    description: "My resume has gaps or doesn't have the right keywords. I'm invisible to the bots.",
  },
  {
    id: 'overqualified-age-bias',
    title: 'I worry I look overqualified or "too old."',
    description: "Hiring managers see my years of experience as a liability, not an asset.",
  },
  {
    id: 'interview-nerves',
    title: "I freeze in interviews.",
    description: "I can do the job, but I lose my confidence when the pressure's on.",
  },
  {
    id: 'positioning-unclear',
    title: "I'm not sure how to position myself.",
    description: "My background is scattered, or I'm making a big pivot. I don't know how to tell my story.",
  },
];

export const BlockerScreen: React.FC<BlockerScreenProps> = ({
  selectedBlocker,
  onBlockerSelect,
  onNext,
}) => {
  return (
    <div className="screen">
      <div className="screen-content">
        <h2>What's the thing that worries you most?</h2>
        <p className="subtext">
          This is where the real work happens. Pick the one that keeps you up at night.
        </p>
        <div className="choices">
          {blockerOptions.map((option) => (
            <ChoiceCard
              key={option.id}
              title={option.title}
              description={option.description}
              isActive={selectedBlocker === option.id}
              onClick={() => onBlockerSelect(option.id)}
            />
          ))}
        </div>
      </div>
      <div className="screen-actions">
        <Button onClick={onNext} variant="primary" disabled={!selectedBlocker}>
          Next
        </Button>
      </div>
      <ProgressBar current={4} />
    </div>
  );
};

import React from 'react';
import { TextInput } from '../shared/TextInput';
import { ProgressBar } from '../shared/ProgressBar';
import { Button } from '../shared/Button';
import { UserSnapshot } from '../../../types/session';
import './SnapshotScreen.css';

interface SnapshotScreenProps {
  snapshot: UserSnapshot;
  onUpdate: (field: keyof UserSnapshot, value: string) => void;
  onNext: () => void;
}

export const SnapshotScreen: React.FC<SnapshotScreenProps> = ({
  snapshot,
  onUpdate,
  onNext,
}) => {
  const isComplete =
    snapshot.currentRole &&
    snapshot.targetRole &&
    snapshot.yearsOfExperience;

  return (
    <div className="screen">
      <div className="screen-content">
        <h2>Help me understand where you are.</h2>
        <p className="subtext">
          This takes 90 seconds. The more honest you are, the better the advice.
        </p>
        <div className="form-group">
          <TextInput
            label="What's your current role (or most recent)?"
            placeholder="E.g., Senior Account Manager, Freelance Consultant, Recently laid off"
            value={snapshot.currentRole}
            onChange={(value) => onUpdate('currentRole', value)}
          />
          <TextInput
            label="What kind of role are you going after?"
            placeholder="E.g., Project Manager, Operations Lead, or still exploring"
            value={snapshot.targetRole}
            onChange={(value) => onUpdate('targetRole', value)}
          />
          <TextInput
            label="How many years of work experience?"
            placeholder="E.g., 22 years, 18 years in marketing"
            value={snapshot.yearsOfExperience}
            onChange={(value) => onUpdate('yearsOfExperience', value)}
          />
          <div className="input-group">
            <label>How confident are you feeling about your search?</label>
            <select
              value={snapshot.confidenceLevel}
              onChange={(e) => onUpdate('confidenceLevel', e.target.value)}
            >
              <option>Solid</option>
              <option>Uncertain</option>
              <option>Worried I'm too old for this</option>
            </select>
          </div>
        </div>
      </div>
      <div className="screen-actions">
        <Button onClick={onNext} variant="primary" disabled={!isComplete}>
          Next
        </Button>
      </div>
      <ProgressBar current={3} />
    </div>
  );
};

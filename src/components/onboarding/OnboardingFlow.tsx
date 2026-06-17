import React from 'react';
import { useSessionState } from '../../hooks/useSessionState';

import { WelcomeScreen } from './screens/WelcomeScreen';
import { ChoosePathScreen } from './screens/ChoosePathScreen';
import { SnapshotScreen } from './screens/SnapshotScreen';
import { BlockerScreen } from './screens/BlockerScreen';
import { ResultScreen } from './screens/ResultScreen';

import './OnboardingFlow.css';

export const OnboardingFlow: React.FC = () => {
  const {
    state,
    goToScreen,
    updatePath,
    updateSnapshot,
    updateBlocker,
    completeSession,
  } = useSessionState();

  const handlePathSelect = (path: Parameters<typeof updatePath>[0]) => {
    updatePath(path);
    goToScreen('snapshot');
  };

  const handleBlockerSelect = (blocker: Parameters<typeof updateBlocker>[0]) => {
    updateBlocker(blocker);
    completeSession();
  };

  return (
    <div className="onboarding-container">
      <div className="phone-frame">
        {state.currentScreen === 'welcome' && (
          <WelcomeScreen onNext={() => goToScreen('path')} />
        )}

        {state.currentScreen === 'path' && (
          <ChoosePathScreen
            selectedPath={state.sessionData.path}
            onPathSelect={handlePathSelect}
            onNext={() => {}}
          />
        )}

        {state.currentScreen === 'snapshot' && (
          <SnapshotScreen
            snapshot={state.sessionData.snapshot}
            onUpdate={updateSnapshot}
            onNext={() => goToScreen('blocker')}
          />
        )}

        {state.currentScreen === 'blocker' && (
          <BlockerScreen
            selectedBlocker={state.sessionData.blocker}
            onBlockerSelect={handleBlockerSelect}
            onNext={() => {}}
          />
        )}

        {state.currentScreen === 'result' && (
          <ResultScreen
            sessionData={state.sessionData}
            onContinue={() => {
              window.location.reload();
            }}
          />
        )}
      </div>
    </div>
  );
};

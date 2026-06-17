import { useState } from 'react';
import { SessionData, OnboardingState, SessionPath, BlockerType } from '../types/session';

export const useSessionState = () => {
  const [state, setState] = useState<OnboardingState>({
    currentScreen: 'welcome',
    sessionData: {
      path: null,
      snapshot: {
        name: '',
        currentRole: '',
        targetRole: '',
        yearsOfExperience: '',
        confidenceLevel: 'Solid',
      },
      blocker: null,
      completedAt: null,
    },
    isLoading: false,
    error: null,
  });

  const goToScreen = (screen: OnboardingState['currentScreen']) => {
    setState((prev) => ({ ...prev, currentScreen: screen }));
  };

  const updatePath = (path: SessionPath) => {
    setState((prev) => ({
      ...prev,
      sessionData: { ...prev.sessionData, path },
    }));
  };

  const updateSnapshot = (field: keyof SessionData['snapshot'], value: string) => {
    setState((prev) => ({
      ...prev,
      sessionData: {
        ...prev.sessionData,
        snapshot: {
          ...prev.sessionData.snapshot,
          [field]: value,
        },
      },
    }));
  };

  const updateBlocker = (blocker: BlockerType) => {
    setState((prev) => ({
      ...prev,
      sessionData: { ...prev.sessionData, blocker },
    }));
  };

  const completeSession = () => {
    setState((prev) => ({
      ...prev,
      sessionData: {
        ...prev.sessionData,
        completedAt: new Date(),
      },
    }));
    goToScreen('result');
  };

  return {
    state,
    goToScreen,
    updatePath,
    updateSnapshot,
    updateBlocker,
    completeSession,
  };
};

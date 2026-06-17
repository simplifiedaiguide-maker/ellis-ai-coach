export type SessionPath = 'mock-interview' | 'resume' | 'linkedin' | 'strategy';
export type ConfidenceLevel = 'Solid' | 'Uncertain' | 'Worried I\'m too old for this';
export type BlockerType =
  | 'ats-filtering'
  | 'overqualified-age-bias'
  | 'interview-nerves'
  | 'positioning-unclear';

export interface UserSnapshot {
  currentRole: string;
  targetRole: string;
  yearsOfExperience: string;
  confidenceLevel: ConfidenceLevel;
}

export interface SessionData {
  path: SessionPath | null;
  snapshot: UserSnapshot;
  blocker: BlockerType | null;
  completedAt: Date | null;
}

export interface OnboardingState {
  currentScreen: 'welcome' | 'path' | 'snapshot' | 'blocker' | 'result';
  sessionData: SessionData;
  isLoading: boolean;
  error: string | null;
}

import { SessionData } from '../types/session';

interface MailerLitePayload {
  email: string;
  name: string;
  sessionData: SessionData;
}

export const subscribeToMailerLite = async (payload: MailerLitePayload): Promise<void> => {
  const response = await fetch('/.netlify/functions/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: payload.email,
      name: payload.name || '',
      path: payload.sessionData.path,
      currentRole: payload.sessionData.snapshot.currentRole,
      targetRole: payload.sessionData.snapshot.targetRole,
      yearsOfExperience: payload.sessionData.snapshot.yearsOfExperience,
      blocker: payload.sessionData.blocker,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Subscription failed' }));
    throw new Error(error.message || 'Subscription failed');
  }
};

import type { Handler } from '@netlify/functions';

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';

const GROUP_IDS: Record<string, string> = {
  'mock-interview': process.env.MAILERLITE_GROUP_MOCK_INTERVIEW || '',
  'resume': process.env.MAILERLITE_GROUP_RESUME || '',
  'linkedin': process.env.MAILERLITE_GROUP_LINKEDIN || '',
  'strategy': process.env.MAILERLITE_GROUP_STRATEGY || '',
};

interface SubscribeRequest {
  email: string;
  name?: string;
  path?: string;
  currentRole?: string;
  targetRole?: string;
  yearsOfExperience?: string;
  blocker?: string;
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  if (!MAILERLITE_API_KEY) {
    console.error('Missing MAILERLITE_API_KEY');
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server configuration error' }),
    };
  }

  let body: SubscribeRequest;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request body' }),
    };
  }

  const { email, name, path, currentRole, targetRole, yearsOfExperience, blocker } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid email address' }),
    };
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
    'Accept': 'application/json',
  };

  const groupId = path && GROUP_IDS[path] ? GROUP_IDS[path] : undefined;

  const payload: Record<string, unknown> = {
    email,
    fields: {
      name: name || '',
      path: path || '',
      current_role: currentRole || '',
      target_role: targetRole || '',
      years_of_experience: yearsOfExperience || '',
      blocker: blocker || '',
    },
    ...(groupId ? { groups: [groupId] } : {}),
  };

  try {
    const response = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    // 200 = updated existing, 201 = created new — both are success
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const msg = (error as { message?: string }).message || 'MailerLite API error';
      console.error('MailerLite error:', response.status, msg);
      throw new Error(msg);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully subscribed', email, path }),
    };
  } catch (error) {
    console.error('Subscribe function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : 'Internal server error',
      }),
    };
  }
};

export { handler };

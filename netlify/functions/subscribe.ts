import type { Handler } from '@netlify/functions';

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_API_URL = 'https://api.mailerlite.com/api/v2';

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

  const subscriber = {
    email,
    name: name || '',
    fields: {
      path: path || '',
      current_role: currentRole || '',
      target_role: targetRole || '',
      years_of_experience: yearsOfExperience || '',
      blocker: blocker || '',
    },
  };

  try {
    // Subscribe to main list
    const response = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': MAILERLITE_API_KEY,
      },
      body: JSON.stringify(subscriber),
    });

    if (!response.ok && response.status !== 422) {
      const error = await response.json().catch(() => ({}));
      throw new Error((error as { error?: { message?: string } }).error?.message || 'MailerLite API error');
    }

    // Add to path-specific group if group ID is configured
    const groupId = path && GROUP_IDS[path];
    if (groupId) {
      await fetch(`${MAILERLITE_API_URL}/groups/${groupId}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MailerLite-ApiKey': MAILERLITE_API_KEY,
        },
        body: JSON.stringify({ email }),
      }).catch((err) => {
        console.error('Failed to add to group:', err);
      });
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

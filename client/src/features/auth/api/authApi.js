const apiBase = import.meta.env.VITE_TMDB_PROXY_URL;

const parseResponse = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || fallbackMessage || 'Request failed';
    throw new Error(message);
  }

  return data;
};

export const registerUser = async (payload) => {
  const response = await fetch(`${apiBase}/api/auth/register`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response, 'Signup failed. Try again.');
};

export const loginUser = async (payload) => {
  const response = await fetch(`${apiBase}/api/auth/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response, 'Invalid email or password');
};

export const verifyEmail = async (token, email) => {
  const emailParam = email ? `&email=${encodeURIComponent(email)}` : '';
  const response = await fetch(
    `${apiBase}/api/auth/verify?token=${encodeURIComponent(token)}${emailParam}`,
    {
      method: 'GET',
    }
  );

  return parseResponse(response, 'Verification failed.');
};

export const resendVerification = async (email) => {
  const response = await fetch(`${apiBase}/api/auth/verify/resend`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  return parseResponse(response, 'Unable to resend verification email.');
};

export const approveEmailChange = async (token) => {
  const response = await fetch(
    `${apiBase}/api/auth/email-change/approve?token=${encodeURIComponent(
      token
    )}`,
    {
      method: 'GET',
    }
  );

  return parseResponse(response, 'Unable to approve email change.');
};

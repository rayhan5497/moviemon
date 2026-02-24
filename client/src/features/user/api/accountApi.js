import { getApiBase, getAuthToken } from '../utils/accountStorage';

export const updateProfileApi = async ({ userInfo, payload }) => {
  const token = getAuthToken(userInfo);
  if (!token) {
    throw new Error('Missing auth token');
  }

  const res = await fetch(`${getApiBase()}/api/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update profile');
  }

  return data;
};

export const uploadAvatarApi = async ({ userInfo, file }) => {
  const token = getAuthToken(userInfo);
  if (!token) {
    throw new Error('Missing auth token');
  }

  const formData = new FormData();
  formData.append('avatar', file);

  const res = await fetch(`${getApiBase()}/api/users/me`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to upload avatar');
  }

  return data;
};

export const deleteAccountApi = async ({ userInfo }) => {
  const token = getAuthToken(userInfo);
  if (!token) {
    throw new Error('Missing auth token');
  }

  const res = await fetch(`${getApiBase()}/api/users/me`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete account');
  }

  return data;
};

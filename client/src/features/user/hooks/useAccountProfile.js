import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '@/shared/context/SnackbarProvider';
import { getAuthToken, setStoredUserInfo } from '../utils/accountStorage';
import { updateProfileApi } from '../api/accountApi';

export const useAccountProfile = ({ userInfo, setUserInfo }) => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: userInfo?.user?.name || '',
    email: userInfo?.user?.email || '',
    currentPassword: '',
    password: '',
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: userInfo?.user?.name || '',
      email: userInfo?.user?.email || '',
    }));
  }, [userInfo]);

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const token = getAuthToken(userInfo);
    if (!token) {
      showSnackbar('You need to login', { color: 'red' });
      return;
    }

    const payload = {};
    if (form.name?.trim()) payload.name = form.name.trim();
    if (form.email?.trim()) payload.email = form.email.trim();
    if (form.currentPassword?.trim()) {
      payload.currentPassword = form.currentPassword.trim();
    }
    if (form.password?.trim()) {
      payload.password = form.password.trim();
      if (!form.currentPassword?.trim()) {
        showSnackbar('Current password is required to change password', {
          color: 'red',
        });
        setSaving(false);
        return;
      }
    }

    if (Object.keys(payload).length === 0) {
      showSnackbar('Nothing to update', { color: 'red' });
      return;
    }

    setSaving(true);
    try {
      const data = await updateProfileApi({ userInfo, payload });
      const {
        requiresVerification = false,
        message,
        ...userData
      } = data || {};
      const nextUserInfo = {
        ...userInfo,
        user: { ...userInfo.user, ...userData },
      };
      setStoredUserInfo(nextUserInfo);
      setUserInfo(nextUserInfo);
      const pendingEmail =
        data?.pendingEmail || payload?.email || nextUserInfo?.user?.email || '';
      if (requiresVerification && pendingEmail) {
        localStorage.setItem(
          'pendingVerificationEmail',
          pendingEmail
        );
        showSnackbar(
          message || 'Verification email sent. Please verify your new email.'
        );
        navigate('/verify-email');
      } else {
        showSnackbar(message || 'Profile updated successfully');
      }
      setForm((prev) => ({ ...prev, password: '', currentPassword: '' }));
    } catch (err) {
      showSnackbar(err.message || 'Profile update failed', { color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  return { form, saving, handleInputChange, handleProfileSave };
};


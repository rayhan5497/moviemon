import { useState } from 'react';
import { useSnackbar } from '@/shared/context/SnackbarProvider';
import { getAuthToken, setStoredUserInfo } from '../utils/accountStorage';
import { uploadAvatarApi } from '../api/accountApi';

export const useAccountAvatar = ({ userInfo, setUserInfo }) => {
  const { showSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (file) => {
    if (!file) return;
    const token = getAuthToken(userInfo);
    if (!token) {
      showSnackbar('You need to login', { color: 'red' });
      return;
    }

    setUploading(true);
    try {
      const data = await uploadAvatarApi({ userInfo, file });
      const nextUserInfo = {
        ...userInfo,
        user: { ...userInfo.user, ...data },
      };
      setStoredUserInfo(nextUserInfo);
      setUserInfo(nextUserInfo);
      showSnackbar('Avatar updated successfully');
    } catch (err) {
      showSnackbar(err.message || 'Avatar upload failed', { color: 'red' });
    } finally {
      setUploading(false);
    }
  };

  return { uploading, handleFileChange };
};


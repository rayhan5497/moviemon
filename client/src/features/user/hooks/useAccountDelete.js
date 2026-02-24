import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '@/context/SnackbarProvider';
import { clearStoredUserInfo, getAuthToken } from '../utils/accountStorage';
import { deleteAccountApi } from '../api/accountApi';

export const useAccountDelete = ({ userInfo }) => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const deleteAccount = async () => {
    const token = getAuthToken(userInfo);
    if (!token) {
      showSnackbar('You need to login', { color: 'red' });
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await deleteAccountApi({ userInfo });
      clearStoredUserInfo();
      showSnackbar('Account deleted');
      navigate('/', { replace: true });
    } catch (err) {
      showSnackbar(err.message || 'Delete account failed', { color: 'red' });
    }
  };

  return { deleteAccount };
};

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '@/shared/context/ModalContext';
import LinkWithScrollSave from '@/shared/components/ui/LinkWithScrollSave';
import { AvatarComponent, Toast } from '@/shared/components/ui/MUI';
import { Camera } from 'lucide-react';
import {
  clearStoredUserInfo,
  setStoredUserInfo,
} from '@/shared/utils/authStorage';
import { useUserMoviesContext } from '@/shared/context/UserMoviesContext';
import { useOutsideClick } from '@/shared/hooks/useOutsideClick';

export default function UserMenuModal({ anchorRef, onLogout }) {
  const { modal, closeModal } = useModal();
  const { userInfo, isAdmin } = useUserMoviesContext();
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'error',
  });
  const menuRef = useRef();

  useOutsideClick(menuRef, closeModal, {
    enabled: modal === 'user',
    ignoreRefs: [anchorRef],
    detectIframe: true,
  });

  const fileInputRef = useRef();

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        if (!userInfo?.token) {
          throw new Error('Missing auth token');
        }

        const formData = new FormData();
        formData.append('avatar', file);

        const response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/users/me`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to upload avatar');
        }

        const nextUserInfo = {
          ...userInfo,
          user: { ...userInfo.user, ...data },
        };

        setStoredUserInfo(nextUserInfo);
        setToast({
          open: true,
          message: 'Avatar updated successfully',
          severity: 'success',
        });
      } catch (err) {
        console.error('Avatar upload failed:', err);
        setToast({
          open: true,
          message: err.message || 'Avatar upload failed',
          severity: 'error',
        });
      } finally {
        e.target.value = '';
      }
    }
  };

  return (
    <AnimatePresence>
      {modal === 'user' && (
        <>
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-auto md:w-[320px] min-w-0 relative md:absolute right-0 mt-2 bg-secondary border border-accent-secondary shadow-accent rounded-lg shadow-lg z-900 flex flex-col overflow-hidden"
          >
            <div className=" p-3 md:p-6 border-b border-accent-secondary items-center justify-center flex flex-col">
              <div className="relative">
                {/* Avatar */}
                <AvatarComponent
                  style={{
                    width: '80px',
                    height: '80px',
                    border: '2px solid gray',
                  }}
                />

                {/* Camera icon overlay */}
                <button
                  onClick={handleFileClick}
                  className="absolute bottom-3 right-3 bg-accent p-1 rounded-full shadow-md transition cursor-pointer hover:scale-110"
                  title="Change Profile"
                >
                  <Camera size={16} className="text-white" />
                </button>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />

              <div className="heading">
                <h2 className="text-primary text-xl font-semibold break-all">
                  {userInfo?.user?.name}
                </h2>
                <p className="text-secondary text-sm break-all">
                  {userInfo?.user?.email}
                </p>
              </div>
            </div>

            {isAdmin && (
              <ProfileLink
                to="/admin"
                label="Admin Dashboard"
                onClick={closeModal}
              />
            )}
            <ProfileLink
              to="/user/saved"
              label="Saved Movies"
              onClick={closeModal}
            />
            <ProfileLink
              to="/user/watch-history"
              label="Watch History"
              onClick={closeModal}
            />
            <ProfileLink
              to="/user/watch-later"
              label="Watch Later"
              onClick={closeModal}
            />
            <ProfileLink
              to="/user/account"
              label="Account Settings"
              onClick={closeModal}
            />

            <button
              className="px-4 py-2 text-red-500 hover:bg-accent-hover transition text-left w-full cursor-pointer"
              onClick={() => {
                clearStoredUserInfo();
                if (onLogout) {
                  onLogout('Logged out successfully');
                }
                closeModal();
              }}
            >
              Logout
            </button>
          </motion.div>
          <Toast
            open={toast.open}
            message={toast.message}
            severity={toast.severity}
            onClose={handleToastClose}
          />
        </>
      )}
    </AnimatePresence>
  );
}

function ProfileLink({ to, label, onClick }) {
  return (
    <LinkWithScrollSave
      to={to}
      onClick={onClick}
      className="px-4 py-3 rounded-lg text-primary hover:bg-accent-hover transition"
    >
      {label}
    </LinkWithScrollSave>
  );
}


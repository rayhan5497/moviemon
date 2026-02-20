import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '@/context/ModalContext';
import LinkWithScrollSave from '@/components/ui/LinkWithScrollSave';
import { AvatarComponent, Toast } from '../../components/ui/MUI';
import { Camera } from 'lucide-react';

export default function UserMenuModal({ anchorRef, onLogout }) {
  const { modal, closeModal } = useModal();
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'error',
  });
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target)
      ) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeModal, anchorRef]);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

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
      console.log('Selected file:', file);
      try {
        if (!userInfo?.token) {
          throw new Error('Missing auth token');
        }

        const formData = new FormData();
        formData.append('avatar', file);

        const response = await fetch(
          `${import.meta.env.VITE_TMDB_PROXY_URL}/api/users/me`,
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
          console.log('data', data)
          throw new Error(data.message || 'Failed to upload avatar');
        }

        const nextUserInfo = {
          ...userInfo,
          user: { ...userInfo.user, ...data },
        };

        localStorage.setItem('userInfo', JSON.stringify(nextUserInfo));
        window.dispatchEvent(new Event('userInfoUpdated'));
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

            <ProfileLink to="/user/saved" label="Saved Movies" />
            <ProfileLink to="/user/watch-history" label="Watch History" />
            <ProfileLink to="/user/watch-later" label="Watch Later" />
            <ProfileLink to="/user/watch-later" label="Account Settings" />

            <button
              className="px-4 py-2 text-red-500 hover:bg-accent-hover transition text-left w-full cursor-pointer"
              onClick={() => {
                localStorage.removeItem('userInfo'); 
                window.dispatchEvent(new Event('userInfoUpdated'));
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

function ProfileLink({ to, label }) {
  return (
    <LinkWithScrollSave
      to={to}
      className="px-4 py-3 rounded-lg text-primary hover:bg-accent-hover transition"
    >
      {label}
    </LinkWithScrollSave>
  );
}

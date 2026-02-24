import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Camera } from 'lucide-react';

import { useIsLg } from '@/hooks/useIsLg';
import Message from '@/components/ui/Message';
import { useModal } from '../context/ModalContext';
import { AvatarComponent } from '@/components/ui/MUI';
import { useAccountUserInfo } from '@/features/user/hooks/useAccountUserInfo';
import { useAccountProfile } from '@/features/user/hooks/useAccountProfile';
import { useAccountAvatar } from '@/features/user/hooks/useAccountAvatar';
import { useAccountDelete } from '@/features/user/hooks/useAccountDelete';

export default function Account() {
  const { closeModal } = useModal();
  const navigate = useNavigate();

  const isLg = useIsLg();
  const fileInputRef = useRef(null);
  const { userInfo, setUserInfo } = useAccountUserInfo();
  const { form, saving, handleInputChange, handleProfileSave } =
    useAccountProfile({ userInfo, setUserInfo });
  const { uploading, handleFileChange } = useAccountAvatar({
    userInfo,
    setUserInfo,
  });
  const { deleteAccount } = useAccountDelete({ userInfo });

  useEffect(() => {
    document.title = 'Account - Moviemon';
  }, []);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  if (!userInfo) {
    return (
      <div className={`movies md:flex md:flex-col ${!isLg ? 'm-2' : 'm-5'}`}>
        <Message icon="🚫" message="You need to login to use this feature" />
      </div>
    );
  }

  return (
    <div className={`movies md:flex md:flex-col ${!isLg ? 'm-2' : 'm-5'}`}>
      <h1 className="heading inset-0 mb-2 text-2xl md:text-3xl font-bold text-accent">
        Account Settings
      </h1>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="bg-primary border border-accent-secondary rounded-lg p-4 flex flex-col items-center gap-4">
          <div className="relative">
            <AvatarComponent
              style={{
                width: '120px',
                height: '120px',
                border: '2px solid gray',
              }}
            />
            <button
              onClick={handleFileClick}
              className="absolute bottom-2 right-2 bg-accent p-2 rounded-full shadow-md transition cursor-pointer hover:scale-110"
              title="Change Profile"
              disabled={uploading}
            >
              <Camera size={16} className="text-white" />
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              handleFileChange(file);
              e.target.value = '';
            }}
            accept="image/*"
          />

          <p className="text-secondary text-sm">
            {uploading ? 'Uploading...' : 'Change your profile picture'}
          </p>
        </div>

        <form
          onSubmit={handleProfileSave}
          className="bg-primary border border-accent-secondary rounded-lg p-4 space-y-4"
        >
          <div>
            <label className="text-sm text-primary block mb-1">New Name</label>
            <input
              type="text"
              name="name"
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-accent-secondary text-primary"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm text-primary block mb-1">New Email</label>
            <input
              type="email"
              name="email"
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-accent-secondary text-primary"
              placeholder="you@example.com"
            />
            <p className="text-xs text-secondary mt-1">
              Changing your email requires verification from both your current
              and new email addresses.
            </p>
          </div>
          <div>
            <label className="text-sm text-primary block mb-1">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-accent-secondary text-primary"
              placeholder="New password"
            />
            <p className="text-xs text-secondary mt-1">
              Changing your password requires verification by email.
            </p>
          </div>
          <div>
            <label className="text-sm text-primary block mb-1">
              Current Password (required to change email and password)
            </label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-accent-secondary text-primary"
              placeholder="Current password"
            />
            <button
              type="button"
              onClick={() => {
                closeModal();
                const emailQuery = form.email
                  ? `?email=${encodeURIComponent(form.email)}`
                  : '';
                navigate(`/forgot-password${emailQuery}`);
              }}
              className="text-sm text-accent hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            disabled={saving}
            className={`w-full py-3 rounded-xl bg-accent-secondary hover:bg-accent-hover transition font-semibold text-accent disabled:opacity-60 ${
              saving ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <div className="border-t border-accent-secondary pt-4">
            <h3 className="text-primary font-semibold mb-2">Danger Zone</h3>
            <button
              type="button"
              onClick={deleteAccount}
              className="w-full py-3 rounded-xl border border-red-500 text-red-400 hover:bg-red-500/10 transition font-semibold"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';

import LinkWithScrollSave from '@/components/ui/LinkWithScrollSave';

import { useEffect, useRef, useState } from 'react';

import { useLocation, useSearchParams } from 'react-router-dom';

import { Menu } from 'lucide-react';
import { X } from 'lucide-react';

import Backdrop from '@/components/ui/Backdrop';

import { saveSidebarState } from '@/utils/userState';
import SearchBox from '@/components/ui/SearchBox';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useIsMd } from '@/hooks/useIsMd';
import { AvatarComponent, GithubButton, ShareButton, Toast } from '@components/ui/MUI';
import { useModal } from '@/context/ModalContext';
import UserMenuModal from '@/features/user/UserProfileModal';

const Header = ({ setIsSidebarOpen, isSidebarOpen }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isSearchPage = location.pathname === '/search';
  const hasQuery = !!searchParams.get('query');

  const handleSidebarClick = () => {
    const nextState = !isSidebarOpen;
    setIsSidebarOpen(nextState);
    saveSidebarState(nextState);
  };

  const isMd = useIsMd();

  const { modal, openModal, closeModal } = useModal();

  const stored = JSON.parse(localStorage.getItem('userInfo'));

  const [isUserLoggedIn, setIsUserLoggedIn ] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (stored) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  }, [stored]);

  const handleLogoutToast = (message) => {
    setToast({
      open: true,
      message: message || 'Logged out',
      severity: 'success',
    });
  };
  const avatarRef = useRef();

  return (
    <header
      className={`col-span-2 w-full z-100 top-0 backdrop-brightness-75 border-b-gray-500/40 border-1 bg-black/80 backdrop-blur-md rounded-b-md md:rounded-bl-none`}
    >
      <div className="headerElContainer flex justify-between items-center md:mx-5 sm:m-3 m-1 min-w-0">
        <div className="sidebar-button-and-logo-wrapper flex items-center gap-10 min-w-0">
          {isSidebarOpen ? (
            <X
              onClick={handleSidebarClick}
              className={`text-white opacity-70 hover:opacity-80 cursor-pointer w-8 p-0 z-20`}
              size={32}
              strokeWidth={3}
              role="button"
            />
          ) : (
            <Menu
              onClick={handleSidebarClick}
              className={`text-white opacity-70 hover:opacity-80 cursor-pointer w-8 p-0 z-20`}
              size={32}
              strokeWidth={3}
              role="button"
            />
          )}

          {isSidebarOpen && (
            <Backdrop
              onClick={handleSidebarClick}
              className="md:hidden z-40"
            />
          )}

          {isSearchOpen && (
            <>
              <Backdrop
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="z-49"
              />
            </>
          )}
          <LinkWithScrollSave
            to="/"
            className="site-name-and-log flex items-center gap-2 min-w-0"
          >
            <img src="/siteLogo.png" className="w-12" alt="" />
            <h1 className="text-red-400 font-bold text-2xl z-10 mr-5 truncate min-w-0">
              Moviemon
            </h1>
          </LinkWithScrollSave>
        </div>
        <div className="search-and-others flex items-center gap-8 lg:gap-15">
          {!(isSearchPage && !hasQuery) && (
            <motion.div layoutId="search-box">
              <SearchBox
                setIsSearchOpen={setIsSearchOpen}
                isSearchOpen={isSearchOpen}
              />
            </motion.div>
          )}
          {isMd && (
            <div className="flex items-center flex-nowrap">
              <div className="flex items-center gap-2">
                <ThemeToggle />

                <ShareButton
                  style={{
                    background: 'gray',
                    width: '1.2em',
                    height: '1.2em',
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                    color: 'white',
                    '&:hover': { background: 'white', color: 'black' },
                  }}
                />
                <GithubButton
                  style={{
                    background: 'gray',
                    width: '1.2em',
                    height: '1.2em',
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                    color: 'white',
                    '&:hover': { background: 'white', color: 'black' },
                  }}
                />
              </div>

              <div className="relative">
                <AvatarComponent
                  tooltip="Profile"
                  ref={avatarRef}
                  onClick={() =>
                    isUserLoggedIn
                      ? modal === 'user'
                        ? closeModal()
                        : openModal('user')
                      : openModal('auth')
                  }
                  style={{ border: '1px solid gray' }}
                />
                <UserMenuModal anchorRef={avatarRef} onLogout={handleLogoutToast} />
              </div>
            </div>
          )}
        </div>
      </div>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </header>
  );
};

export default Header;

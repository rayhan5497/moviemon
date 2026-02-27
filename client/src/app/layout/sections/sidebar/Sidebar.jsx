import { GoHome, GoHomeFill } from 'react-icons/go';
import { RiMovie2AiLine, RiMovie2AiFill } from 'react-icons/ri';
import { BiTv, BiSolidTv } from 'react-icons/bi';
import { RiFolderCloudLine, RiFolderCloudFill } from 'react-icons/ri';

import { useMatch } from 'react-router-dom';

import NavSection from './NavSection';
import ThemeToggle from '@/shared/components/ui/ThemeToggle';
import { useIsMd } from '@/shared/hooks/useIsMd';
import {
  AvatarComponent,
  GithubButton,
  ShareButton,
} from '@/shared/components/ui/MUI';
import { useModal } from '@/shared/context/ModalContext';
import { useRef } from 'react';
import UserMenuModal from '@/features/user/UserProfileModal';
import { useUserMoviesContext } from '@/shared/context/UserMoviesContext';
import { useSnackbar } from '@/shared/context/SnackbarProvider';

const Sidebar = ({ isSidebarOpen }) => {
  const isHomeActive = useMatch('/');
  const isMovieActive = useMatch('discover/movie');
  const isTvActive = useMatch('discover/tv');
  const isLibraryActive = useMatch('/user/*');
  const { isLoggedIn } = useUserMoviesContext();
  const { showSnackbar } = useSnackbar();

  const isMd = useIsMd();

  const { modal, openModal, closeModal } = useModal();

  const isUserLoggedIn = localStorage.getItem('userInfo');

  const avatarRef = useRef();

  const handleClick = () => {
    if (!isLoggedIn) {
      showSnackbar('Login to use this feature', { color: 'white' });
    }
  };

  return (
    <aside
      className={`sidebar fixed md:static transition duration-300 text-white z-49 bg-gray-800 top-0 left-0 pb-5 px-5 min-[450px]:w-60 w-[70%] min-[350px]:w-[50%] h-full pt-24 md:pt-5 overflow-auto
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} `}
    >
      {!isMd && (
        <div className="flex items-center flex-col gap-4 mb-8">
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
              style={{
                width: '50px',
                height: '50px',
                border: '1px solid gray',
              }}
            />
            <UserMenuModal anchorRef={avatarRef} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ThemeToggle />
            <ShareButton
              style={{
                background: 'gray',
                width: '1.2em',
                height: '1.2em',
                cursor: 'pointer',
                transition: 'background 0.1s',
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
                transition: 'background 0.1s',
                color: 'white',
                '&:hover': { background: 'white', color: 'black' },
              }}
            />
          </div>
        </div>
      )}
      <NavSection
        icon={GoHome}
        iconFill={GoHomeFill}
        isSectionActive={isHomeActive}
        title={{ label: 'Home', path: '/' }}
        items={[]}
      />
      <NavSection
        icon={RiMovie2AiLine}
        iconFill={RiMovie2AiFill}
        title={{ label: 'Movies', path: '/discover/movie' }}
        isSectionActive={isMovieActive}
        items={[
          {
            label: 'English',
            path: '/discover/movie?with_original_language=en',
          },
          { label: 'Hindi', path: '/discover/movie?with_original_language=hi' },
          {
            label: 'Bangla',
            path: '/discover/movie?with_original_language=bn',
          },
        ]}
      />
      <NavSection
        icon={BiTv}
        iconFill={BiSolidTv}
        title={{ label: 'TV Series', path: '/discover/tv' }}
        isSectionActive={isTvActive}
        items={[
          { label: 'English', path: '/discover/tv?with_original_language=en' },
          { label: 'Hindi', path: '/discover/tv?with_original_language=hi' },
          { label: 'Bangla', path: '/discover/tv?with_original_language=bn' },
        ]}
      />

      <NavSection
        onClick={handleClick}
        icon={RiFolderCloudLine}
        iconFill={RiFolderCloudFill}
        title={{ label: 'Library', path: '/user' }}
        isSectionActive={isLibraryActive}
        disabled={!isLoggedIn}
        items={[
          { label: 'Saved', path: '/user/saved' },
          { label: 'Watch Later', path: '/user/watch-later' },
          { label: 'Watch History', path: '/user/watch-history' },
        ]}
      />
    </aside>
  );
};

export default Sidebar;


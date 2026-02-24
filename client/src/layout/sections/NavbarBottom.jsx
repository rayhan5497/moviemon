import { GoHome, GoHomeFill } from 'react-icons/go';
import { RiMovie2AiLine, RiMovie2AiFill } from 'react-icons/ri';
import { BiTv, BiSolidTv } from 'react-icons/bi';
import { RiFolderCloudLine, RiFolderCloudFill } from 'react-icons/ri';
import { Tooltip } from '@mui/material';

import { NavLink, useLocation } from 'react-router-dom';

import GradientIcon from '@/components/ui/GradientIcon';
import { useUserMoviesContext } from '../../context/UserMoviesContext';
import { useSnackbar } from '../../context/SnackbarProvider';

const NavbarBottom = () => {
  const { pathname } = useLocation();
  const isHomeActive = pathname === '/';
  const isMovieActive = pathname.startsWith('/discover/movie');
  const isTvActive = pathname.startsWith('/discover/tv');
  const isSavedActive = pathname.startsWith('/user');
  const { isLoggedIn } = useUserMoviesContext();
  const { showSnackbar } = useSnackbar();

  const handleClick = () => {
    if (!isLoggedIn) {
      showSnackbar('Login to use this feature', { color: 'white' });
    }
  };

  return (
    <div className="nav-bottom md:hidden text-sm fixed bg-black/80 backdrop-blur-md z-10 bottom-0 w-full flex justify-around py-2 rounded-t-md h-14">
      <NavLink
        to={'/'}
        className="home-btn cursor-pointer flex flex-col items-center"
      >
        {!isHomeActive && (
          <>
            <GoHome className="w-10 h-10 text-gray-400" />
            <div className="title text-gray-400">Home</div>
          </>
        )}

        {isHomeActive && (
          <>
            <GradientIcon Icon={GoHomeFill} size={40} />
            <div className="title text-white">Home</div>
          </>
        )}
      </NavLink>
      <NavLink
        to={'/discover/movie'}
        className="movie-btn cursor-pointer flex flex-col items-center"
      >
        {!isMovieActive && (
          <>
            <RiMovie2AiLine className="w-10 h-10 text-gray-400" />
            <div className="title text-gray-400">Movie</div>
          </>
        )}

        {isMovieActive && (
          <>
            <GradientIcon Icon={RiMovie2AiFill} size={40} />
            <div className="title text-white">Movie</div>
          </>
        )}
      </NavLink>
      <NavLink
        to={'discover/tv'}
        className="tv-btn cursor-pointer flex flex-col items-center"
      >
        {!isTvActive && (
          <>
            <BiTv className="w-10 h-10 text-gray-400" />
            <div className="title text-gray-400">TV Show</div>
          </>
        )}

        {isTvActive && (
          <>
            <GradientIcon Icon={BiSolidTv} size={40} />
            <div className="title text-white">TV Show</div>
          </>
        )}
      </NavLink>
      <Tooltip title={!isLoggedIn && 'Login to use this feature'}>
        <NavLink
          disabled={!isLoggedIn}
          onClick={handleClick}
          to={!isLoggedIn ? '#' : '/user'}
          className={`saved-btn cursor-pointer flex flex-col items-center ${
            !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {!isSavedActive && (
            <>
              <RiFolderCloudLine className="w-10 h-10 text-gray-400" />
              <div className="title text-gray-400">Library</div>
            </>
          )}

          {isSavedActive && (
            <>
              <GradientIcon Icon={RiFolderCloudFill} size={40} />
              <div className="title text-white">Library</div>
            </>
          )}
        </NavLink>
      </Tooltip>
    </div>
  );
};

export default NavbarBottom;

import { useState } from 'react';
import LinkWithScrollSave from '../ui/LinkWithScrollSave';
import { useIsMd } from '@/shared/hooks/useIsMd';
import { useUserMoviesContext } from '@/shared/context/UserMoviesContext';
import { getMediaRating } from '@/shared/utils/mediaRatings';
import getRatingColor from '@/shared/utils/ratingColor';

const MovieCard = ({
  media,
  onSave,
  onWatchLater,
  ratingSource = 'preferred',
}) => {
  const isMd = useIsMd();
  const [imgLoaded, setImgLoaded] = useState(false);
  const isSaved = Boolean(media?.saved);
  const isWatchLater = Boolean(media?.watchLater);
  const { isLoggedIn } = useUserMoviesContext();
  const rating = getMediaRating(media, ratingSource);
  const isIMDB = Number(media?.imdb_rating) === Number(rating);
  const ratingColor = getRatingColor(rating);

  const getPath = () => {
    if (media?.title) {
      return `/player/movie/${media?.id}`;
    } else {
      return `/player/tv/${media?.id}`;
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onSave) onSave(media.id, !isSaved);
  };

  const handleWatchLater = (e) => {
    e.preventDefault();
    if (onWatchLater) onWatchLater(media.id, !isWatchLater);
  };

  return (
    <LinkWithScrollSave
      to={getPath()}
      data-id={media?.id}
      className="group card md:snap-start bg-primary relative cursor-pointer rounded-lg sm:p-1 hover:scale-105 transition-all duration-200 shadow-md shadow-accent w-full flex flex-col mb-1"
    >
      {/* Poster */}
      <div className="poster-container relative">
        <div className="poster bg-secondary content-center text-center aspect-[2/3] w-full rounded">
          {media?.poster_path ? (
            <>
              <img
                className={`w-full h-full object-cover rounded ${
                  !imgLoaded ? 'invisible' : 'visible'
                }`}
                src={`https://image.tmdb.org/t/p/${isMd ? 'w342' : 'w185'}${
                  media?.poster_path
                }`}
                alt={media?.title}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
              />
              {!imgLoaded && (
                <div className="!absolute inset-0 skeleton-shimmer rounded-lg"></div>
              )}
            </>
          ) : (
            <span className="text-secondary">No Poster</span>
          )}
        </div>

        <p className="yea rounded m-0 absolute text-sm sm:text-[1rem] top-1 left-1 px-[0.3rem] bg-accent text-primary font-semibold">
          {(media?.release_date ?? media?.first_air_date)?.slice(0, 4) || 'N/A'}
        </p>
        <div className="rating text-orange-300 text-[1.2rem] font-bold bg-[#0000007a] px-[0.3rem] py-[0rem] rounded absolute right-1 bottom-1 items-center flex gap-1 flex-col">
          <div className="opacity-80 mt-[0.3rem] -mb-1">
            {isIMDB ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="17"
                viewBox="0 0 64 32"
                version="1.1"
              >
                <g fill="#F5C518">
                  <rect x="0" y="0" width="100%" height="100%" rx="4"></rect>
                </g>
                <g
                  transform="translate(8.000000, 7.000000)"
                  fill="#000000"
                  fillRule="nonzero"
                >
                  <polygon points="0 18 5 18 5 0 0 0"></polygon>
                  <path d="M15.6725178,0 L14.5534833,8.40846934 L13.8582008,3.83502426 C13.65661,2.37009263 13.4632474,1.09175121 13.278113,0 L7,0 L7,18 L11.2416347,18 L11.2580911,6.11380679 L13.0436094,18 L16.0633571,18 L17.7583653,5.8517865 L17.7707076,18 L22,18 L22,0 L15.6725178,0 Z"></path>
                  <path d="M24,18 L24,0 L31.8045586,0 C33.5693522,0 35,1.41994415 35,3.17660424 L35,14.8233958 C35,16.5777858 33.5716617,18 31.8045586,18 L24,18 Z M29.8322479,3.2395236 C29.6339219,3.13233348 29.2545158,3.08072342 28.7026524,3.08072342 L28.7026524,14.8914865 C29.4312846,14.8914865 29.8796736,14.7604764 30.0478195,14.4865461 C30.2159654,14.2165858 30.3021941,13.486105 30.3021941,12.2871637 L30.3021941,5.3078959 C30.3021941,4.49404499 30.272014,3.97397442 30.2159654,3.74371416 C30.1599168,3.5134539 30.0348852,3.34671372 29.8322479,3.2395236 Z"></path>
                  <path d="M44.4299079,4.50685823 L44.749518,4.50685823 C46.5447098,4.50685823 48,5.91267586 48,7.64486762 L48,14.8619906 C48,16.5950653 46.5451816,18 44.749518,18 L44.4299079,18 C43.3314617,18 42.3602746,17.4736618 41.7718697,16.6682739 L41.4838962,17.7687785 L37,17.7687785 L37,0 L41.7843263,0 L41.7843263,5.78053556 C42.4024982,5.01015739 43.3551514,4.50685823 44.4299079,4.50685823 Z M43.4055679,13.2842155 L43.4055679,9.01907814 C43.4055679,8.31433946 43.3603268,7.85185468 43.2660746,7.63896485 C43.1718224,7.42607505 42.7955881,7.2893916 42.5316822,7.2893916 C42.267776,7.2893916 41.8607934,7.40047379 41.7816216,7.58767002 L41.7816216,9.01907814 L41.7816216,13.4207851 L41.7816216,14.8074788 C41.8721037,15.0130276 42.2602358,15.1274059 42.5316822,15.1274059 C42.8031285,15.1274059 43.1982131,15.0166981 43.281155,14.8074788 C43.3640968,14.5982595 43.4055679,14.0880581 43.4055679,13.2842155 Z"></path>
                </g>
              </svg>
            ) : (
              <div
                className="text-[0.5rem] px-0.5 rounded font-extrabold text-black"
                style={{
                  background:
                    'linear-gradient(90deg, #01b4e4 0%, #90cea1 100%)',
                  transform: 'scaleY(1.2)',
                  transformOrigin: 'center',
                }}
              >
                TMDB
              </div>
            )}
          </div>
          <div className={ratingColor}>{rating ? rating.toFixed(1) : 'N/A'}</div>
        </div>

        {/* Play Button */}
        <button className="play-btn cursor-pointer bg-[#0000007a] hover:scale-110 opacity-0 scale-125 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 p-[0.5rem] rounded-full font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            className="w-10 h-10"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        {/* Save & Watch Later Buttons */}
        <div className="opacity-80 absolute left-1 bottom-1 flex gap-0 md:gap-1 items-center justify-center">
          {/* Save */}
          <button
            disabled={isMd && !isLoggedIn}
            onClick={handleSave}
            className={`flex items-center justify-center p-1 rounded-full transition-colors ${
              isLoggedIn
                ? 'cursor-pointer hover:bg-red-500'
                : 'cursor-not-allowed'
            } ${
              isSaved ? 'bg-accent text-white' : 'bg-[#0000007a] text-white'
            }`}
            title={
              isLoggedIn
                ? isSaved
                  ? 'Click to remove from collection'
                  : 'Click to add in collection'
                : 'Login to use this feature'
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isSaved ? 'white' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
              />
            </svg>
          </button>

          {/* Watch Later */}
          <button
            disabled={isMd && !isLoggedIn}
            onClick={handleWatchLater}
            className={`flex items-center justify-center p-1 rounded-full transition-colors ${
              isLoggedIn
                ? 'cursor-pointer hover:bg-blue-500'
                : 'cursor-not-allowed'
            } ${
              isWatchLater
                ? 'bg-accent text-white'
                : 'bg-[#0000007a] text-white'
            }`}
            title={
              isLoggedIn
                ? isWatchLater
                  ? 'Click to remove from watch later'
                  : 'Click to save in watch later'
                : 'Login to use this feature'
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <circle cx="12" cy="12" r="10" strokeWidth={2} />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6l4 2"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Movie Title */}
      <h2 className="name text-primary text-xs sm:text-[0.8rem] p-[0.3em] m-0 font-medium truncate">
        {media.name || media.title || 'N/A'}
      </h2>
    </LinkWithScrollSave>
  );
};

export default MovieCard;

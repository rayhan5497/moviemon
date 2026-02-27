import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function CastCard ({ cast }) {

  const [imgLoaded, setImgLoaded] = useState(false);

  const name = cast?.name || 'Unknown'
  const character = cast?.character || 'Unknown'
  const profilePath = cast?.profile_path
  const adult = cast?.adult

  return (
    <NavLink
      to={`/person/${cast?.id}`}
      data-id={cast?.id}
      className={`group card gap-1 md:snap-start relative cursor-pointer rounded-lg sm:rounded sm:p-1 hover:scale-105 transition-all duration-200 shadow-md shadow-accent w-full flex flex-col mb-1`}
    >
      <div className="poster-container relative">
        <div
          className={`poster ${
            !profilePath ? 'bg-gray-500/50 rounded-full' : ''
          } content-center text-center aspect-[2/3] w-20 h-20`}
        >
          {profilePath ? (
            <>
              <img
                className={`w-full h-full object-cover rounded-full ${
                  !imgLoaded ? 'invisible' : 'visible'
                }`}
                src={`https://image.tmdb.org/t/p/w185${profilePath}`}
                alt={name}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
              />

              {/* Shimmer Skeleton */}
              {!imgLoaded && (
                <>
                  <div className="absolute inset-0 bg-secondary w-20 h-20 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(
              135deg,
              rgba(255,255,255,0) 0%,
              rgba(126,126,126,0.20) 50%,
              rgba(255,255,255,0) 100%
            )`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '300% 300%', // big enough to move smoothly
                        animation: `shimmer 1s infinite linear`,
                        animationDelay: `${Math.random() * 0.5}s`,
                      }}
                    ></div>
                  </div>
                </>
              )}
            </>
          ) : (
            <span className="text-white/50 text-[1rem]">N/A</span>
          )}
        </div>

        <p className="rating text-orange-300 text-[0.7rem] font-bold bg-[#0000007a] px-[0.3rem] py-[0rem] rounded absolute right-10 bottom-0">
          {adult ? 'adult' : ''}
        </p>
      </div>

      <h3 className="name text-white/80 text-sm/[1em] sm:text-[1rem] m-0 font-medium truncate">
        {name}
      </h3>
      <h3 className="name text-white/50 text-sm/[1em] sm:text-[1rem] m-0 font-medium truncate">
        {character}
      </h3>
    </NavLink>
  );
};

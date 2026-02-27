import { NavLink } from 'react-router-dom';

import HeadingDetailsSection from '@/shared/components/sections/HeadingDetails';
import HighLightSection from '@/shared/components/sections/HighLight';

import { useIsLg } from '@/shared/hooks/useIsLg';
import { useIsMd } from '@/shared/hooks/useIsMd';
import { useIsXs } from '@/shared/hooks/useIsXs';

const IMAGE_BASE = 'https://image.tmdb.org/t/p';

const truncate = (text = '', max = 20) =>
  text.length > max ? text.slice(0, max) + '...' : text;

const HeroSlide = ({ item }) => {
  const isLg = useIsLg();
  const isMd = useIsMd();
  const isXs = useIsXs();

  const title = item.title || item.name;

  // Responsive rules
  let titleLimit = 20;
  let overviewLimit = 0;
  let showHeadingDetails = false;

  if (isLg) {
    titleLimit = 20;
    overviewLimit = 200;
  } else if (isMd) {
    titleLimit = 20;
    overviewLimit = 150;
    showHeadingDetails = true;
  } else if (!isXs) {
    titleLimit = 15;
  }

  const backdrop = item.backdrop_path
    ? `${IMAGE_BASE}/${isLg ? 'w780' : isMd ? 'w500' : isXs ? 'w300' : 'w92'}${
        item.backdrop_path
      }`
    : '';

  const poster = item.poster_path
    ? `${IMAGE_BASE}/${isLg ? 'w780' : isMd ? 'w500' : isXs ? 'w300' : 'w92'}${
        item.poster_path
      }`
    : '';

  const link = item.title
    ? `/player/movie/${item.id}`
    : `/player/tv/${item.id}`;

  return (
    <div className="relative h-full w-full">
      <img
        src={backdrop}
        alt={title}
        className="h-full w-full object-cover blur-xl"
      />
      <img
        src={backdrop}
        alt={title}
        className="h-full w-full object-contain absolute top-0"
      />

      <div className="absolute inset-0 bg-black/60 flex flex-col lg:flex-row justify-center p-10 lg:p-20 gap-4">
        <div className="flex gap-5 items-center w-full">
          <img
            src={poster}
            alt={title}
            className={`rounded-lg w-full h-auto ${
              isLg ? 'max-w-48' : isXs ? 'max-w-30' : 'max-w-20'
            }`}
          />

          <div className="text-white flex flex-col gap-3 md:gap-5">
            <h2
              className={`font-bold ${
                isLg ? 'text-5xl' : isMd ? 'text-2xl' : 'text-sm'
              }`}
            >
              {truncate(title, titleLimit)}
            </h2>

            {overviewLimit > 0 && (
              <p className="max-w-xl text-sm md:text-base">
                {truncate(item.overview, overviewLimit)}
              </p>
            )}

            {showHeadingDetails && <HeadingDetailsSection media={item} />}

            <NavLink className="w-fit rounded-full" to={link}>
              <button className="bg-[#0000007a] hover:scale-110 transition-all p-2 rounded-full shadow-xs shadow-white cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  className={`w-5 h-5 ${isXs ? 'w-10 h-10' : ''}`}
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </NavLink>
          </div>
        </div>

        <HighLightSection
          media={item}
          className="hidden lg:flex lg:items-end text-white"
        />
      </div>
    </div>
  );
};

export default HeroSlide;


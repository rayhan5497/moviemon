import MovieCard from '../cards/MovieCard';
import CastCard from '../cards/CastCard';
import ScrollNavigator from '@components/ui/ScrollNavigator';

import { useHorizontalScroll } from '@hooks/useHorizontalScroll';
import { useIsMd } from '@hooks/useIsMd';
import { useIsLg } from '@hooks/useIsLg';
import LinkWithScrollSave from '../ui/LinkWithScrollSave';

const HorizontalCardCarousel = ({
  media,
  title,
  route,
  Icon,
  className = '',
  type,
  CardComponent = MovieCard,
}) => {
  const {
    containerRef,
    itemWidth,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
  } = useHorizontalScroll({
    defaultMin: 170,
    mdMin: 140,
    smMin: 110,
    isMd: useIsMd(),
    isLg: useIsLg(),
  });

  return (
    media && (
      <div className="recommendation-section relative mb-2 xl:w-full">
        <div className="link flex justify-between items-baseline">
          <div className="section-title-link relative text-orange-400 items-center inline-flex p-0 rounded-md text-[1.2rem] md:text-[1.5rem] font-semibold gap-1">
            {route ? (
              <LinkWithScrollSave
                to={route}
                className={`hover:underline ${className}`}
              >
                {title}
              </LinkWithScrollSave>
            ) : (
              <span className={`${className}`}>{title}</span>
            )}
            {Icon && <Icon />}
          </div>
          {route && (
            <LinkWithScrollSave
              to={route}
              className="section-title-link items-center relative text-link inline-flex p-0 rounded-md text-xl font-semibold hover:underline"
            >
              <div className="title text-[1rem]">All</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="25"
                height="25"
              >
                <g id="_01_align_center" data-name="01 align center">
                  <path
                    className="fill-blue-400"
                    d="M10.811,18.707,9.4,17.293,14.689,12,9.4,6.707l1.415-1.414L16.1,10.586a2,2,0,0,1,0,2.828Z"
                  />
                </g>
              </svg>
            </LinkWithScrollSave>
          )}
        </div>

        <ScrollNavigator
          canScrollPrev={canScrollPrev}
          canScrollNext={canScrollNext}
          onPrev={scrollPrev}
          onNext={scrollNext}
        />
        <div
          className="movie-wrapper movies-grid grid [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] gap-2 md:gap-0 mt-0 md:mt-0 grid-flow-col overflow-y-hidden overflow-x-auto snap-x snap-mandatory scroll-smooth"
          style={{
            gridAutoColumns: itemWidth ? `${itemWidth}px` : undefined,
          }}
          ref={containerRef}
        >
          {type === 'cast'
            ? media?.map((c) => <CastCard key={c.credit_id} cast={c} />)
            : media?.map((r) => (
                <div key={r.id} className="card-wrapper md:mr-2">
                  <CardComponent media={r} />
                </div>
              ))}
        </div>
      </div>
    )
  );
};

export default HorizontalCardCarousel;

import { useEffect, useRef, useState, useContext } from 'react';
import { useIsMd } from '@/shared/hooks/useIsMd';
import Backdrop from '../../ui/Backdrop';
import FilterSection from '../movie/FilterSection';
import filtersData from '@/shared/data/filters.json';
import MainScrollContext from '@/shared/context/MainScrollContext';

export default function FilterLibraryMedia({ selectedMedia, onMediaChange }) {
  const { mainRef } = useContext(MainScrollContext);
  const isMd = useIsMd();

  const [showFilter, setShowFilter] = useState(true);
  const [open, setOpen] = useState({ media: false });
  const mediaElRef = useRef(null);
  const ignoreScroll = useRef(false);

  useEffect(() => {
    if (isMd) {
      setOpen({ media: true });
      setShowFilter(true);
    } else {
      setOpen({ media: false });
      setShowFilter(false);
    }
  }, [isMd]);

  const handleFiltersToggle = () => {
    setOpen((prev) => ({ media: !prev.media }));
  };

  useEffect(() => {
    const onDocClick = (e) => {
      const clickedInside = mediaElRef.current?.contains(e.target);
      if (!clickedInside && !isMd) {
        setOpen({ media: false });
      }
    };

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isMd]);

  useEffect(() => {
    const container = mainRef?.current;
    if (!container) return;

    if (!isMd) {
      const anyOpen = Object.values(open).some(Boolean);
      container.style.overflow = anyOpen ? 'hidden' : 'auto';
    } else {
      container.style.overflow = 'auto';
    }

    return () => {
      if (container) container.style.overflow = 'auto';
    };
  }, [open, isMd, mainRef]);

  useEffect(() => {
    const container = mainRef?.current;
    if (!container) return;

    const onScroll = () => {
      if (ignoreScroll.current) return;
      setShowFilter(false);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [mainRef]);

  const handleFilterHeadingClick = () => {
    ignoreScroll.current = true;
    setShowFilter((s) => !s);
    setTimeout(() => {
      ignoreScroll.current = false;
    }, 120);
  };

  const isFiltersOpen = (name) => !!open[name];
  const isAnyOpen = Object.values(open).some(Boolean);

  const mediaLabel =
    filtersData['media'].find((t) => t.value === selectedMedia)?.label || '';

  return (
    <>
      {isAnyOpen && (
        <Backdrop
          onClick={() => setOpen({ media: false })}
          className="md:hidden z-30"
        />
      )}

      <div className="filters bg-primary text-primary p-2 md:px-4 rounded-lg space-y-4 sticky top-0 z-40">
        <h1
          className="filter-heading w-fit bg-accent-secondary p-2 rounded m-0 cursor-pointer"
          onClick={handleFilterHeadingClick}
        >
          <span className="font-bold">
            Filter{' '}
            <svg
              className="inline"
              height="15"
              viewBox="0 0 24 24"
              width="15"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-text-primary"
                d="m15 24-6-4.5v-5.12l-8-9v-2.38a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v2.38l-8 9z"
              />
            </svg>{' '}
          </span>

          <span className="font-light">
            {!showFilter && mediaLabel && (
              <span className="mr-1">🔹{mediaLabel}</span>
            )}
          </span>
        </h1>

        <div
          className={`filters-wrapper flex flex-wrap gap-2 ${
            !showFilter ? 'hidden' : ''
          }`}
        >
          <FilterSection
            className={`media filter-category ${
              isFiltersOpen('media') ? 'md:w-full' : ''
            }`}
            ref={mediaElRef}
            onClick={handleFiltersToggle}
            selected={selectedMedia}
            isMd={isMd}
            label={mediaLabel}
            isFiltersOpen={isFiltersOpen}
            handleChange={onMediaChange}
            category={'media'}
          />
        </div>
      </div>
    </>
  );
}


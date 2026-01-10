import { useEffect, useState, useRef, useContext } from 'react';

import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { useIsMd } from '../../../hooks/useIsMd';
import Backdrop from '../../ui/Backdrop';
import FilterSection from './FilterSection';
import filtersData from '../../../data/filters.json';
import MainScrollContext from '../../../context/MainScrollContext';

const allowedTypes = ['all', 'movie', 'tv'];
const allowedTimes = ['day', 'week'];

const FilterMovies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const typeInLocation =
    allowedTypes.filter((t) => t === params.mediaType) || 'all';
  const timeInLocation =
    allowedTimes.filter((t) => t === params.timeWindow) || 'day';

  const [selectedType, setSelectedType] = useState(typeInLocation);
  const [selectedTimeWindow, setSelectedTimeWindow] = useState(timeInLocation);

  useEffect(() => {
    const segments = location.pathname.split('/').filter(Boolean);

    const type = segments[1] || 'all';
    const time = segments[2] || 'day';

    const extraSegments = segments.length > 3;

    const invalid =
      !allowedTypes.includes(type) ||
      !allowedTimes.includes(time) ||
      extraSegments;

    if (invalid) {
      setSelectedType('all');
      setSelectedTimeWindow('day');
    } else {
      setSelectedType(type);
      setSelectedTimeWindow(time);
    }
  }, [location.pathname]);

  // Show/hide filter panel
  const [showFilter, setShowFilter] = useState(true);

  // Refs for DOM elements
  const typeElRef = useRef();
  const timeElRef = useRef();

  // Prevent infinite loop when syncing state with URL
  const isUpdatingFromState = useRef(false);

  // Sync state when URL changes externally
  useEffect(() => {
    if (isUpdatingFromState.current) return;

    const segments = location.pathname.split('/').filter(Boolean);
    const type = segments[1] || 'all';
    const time = segments[2] || 'day';

    setSelectedType(type);
    setSelectedTimeWindow(time);
  }, [location.pathname]);

  // Sync URL when state changes
  useEffect(() => {
    const newPath = `/trending/${selectedType}/${selectedTimeWindow}`;
    if (newPath !== location.pathname) {
      isUpdatingFromState.current = true;
      navigate(newPath);
      setTimeout(() => {
        isUpdatingFromState.current = false;
      }, 20);
    }
  }, [selectedType, selectedTimeWindow]);

  // Handlers for dropdown/select changes
  const handleTypeChange = (e) => setSelectedType(e.target.value);
  const handleTimeWindowChange = (e) => setSelectedTimeWindow(e.target.value);

  // Labels for display
  const typeLabel =
    filtersData['trending-types'].find((t) => t.value === selectedType)
      ?.label || '';
  const timeWindowLabel =
    filtersData['trending-times'].find((t) => t.value === selectedTimeWindow)
      ?.label || '';

  const isMd = useIsMd();

  const [open, setOpen] = useState({
    type: false,
    time: false,
  });

  const handleFiltersToggle = (filterName) => {
    if (!isMd) {
      // Mobile: only one open at a time
      if (!filterName) return;
      setOpen((prev) => ({
        type: false,
        time: false,
        [filterName]: !prev[filterName],
      }));
    } else {
      // Desktop: toggle independently
      setOpen((prev) => ({
        ...prev,
        [filterName]: !prev[filterName],
      }));
    }
  };

  useEffect(() => {
    if (isMd) {
      setOpen((prev) =>
        Object.fromEntries(Object.keys(prev).map((key) => [key, true]))
      );
      setShowFilter(true);
      return;
    } else {
      setOpen((prev) =>
        Object.fromEntries(Object.keys(prev).map((key) => [key, false]))
      );
    }

    setShowFilter(false);
    const handler = (e) => {
      if (
        !typeElRef.current?.contains(e.target) &&
        !timeElRef.current?.contains(e.target)
      ) {
        // handleFiltersToggle(null);
        setOpen({
          type: false,
          time: false,
        });
      }
    };

    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, [isMd]);

  const { mainRef } = useContext(MainScrollContext);

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;
    if (!isMd) {
      const isAnyOpen = Object.values(open).some((v) => v === true);
      if (isAnyOpen) {
        container.style.overflow = 'hidden';
      } else {
        container.style.overflow = 'auto';
      }
    } else {
      container.style.overflow = 'auto';
    }
    return () => {
      container.style.overflow = 'auto';
    };
  }, [open, isMd]);

  const ignoreScroll = useRef(false);

  const handleFilterHeadingClick = () => {
    ignoreScroll.current = true;
    setShowFilter((prev) => !prev);
    setTimeout(() => {
      ignoreScroll.current = false;
    }, 100); // small delay to ignore scroll event immediately after click
  };

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const handleShowFilter = () => {
      if (ignoreScroll.current) return; // skip if click just happened
      setShowFilter(false);
    };

    container.addEventListener('scroll', handleShowFilter, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleShowFilter, {
        passive: true,
      });
    };
  }, [mainRef]);

  const isFiltersOpen = (filterName) => {
    return open[filterName];
  };

  const isAnyOpen = Object.values(open).some(Boolean);

  return (
    <>
      {isAnyOpen && (
        <Backdrop
          onClick={() => {
            setOpen((prev) => {
              const newState = Object.fromEntries(
                Object.keys(prev).map((key) => [key, false])
              );
              return newState;
            });
          }}
          className="md:hidden z-30"
        />
      )}
      <div className="filters bg-primary text-primary p-2 px-3 md:px-4 rounded-lg space-y-4 sticky top-0 z-40">
        <h1
          className={`filter-heading w-fit bg-accent-secondary p-2 rounded m-0 cursor-pointer ${
            !showFilter ? 'm-0' : ''
          }`}
          onClick={handleFilterHeadingClick}
        >
          <span className="font-bold">
            Filter{' '}
            <svg
              className="inline"
              id="Layer_1"
              height="15"
              viewBox="0 0 24 24"
              width="15"
              xmlns="http://www.w3.org/2000/svg"
              data-name="Layer 1"
            >
              <path
                className="fill-text-primary"
                d="m15 24-6-4.5v-5.12l-8-9v-2.38a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v2.38l-8 9z"
              />
            </svg>{' '}
          </span>
          <span className="font-light">
            {!showFilter && (
              <>
                {typeLabel && '🔹Media Type '}
                {timeWindowLabel && '🔹Time Window '}
              </>
            )}
          </span>
        </h1>
        <div
          className={`filters-wrapper flex flex-wrap gap-2 ${
            !showFilter ? 'hidden' : ''
          }`}
        >
          <FilterSection
            className={`language filter-category ${
              isFiltersOpen('type') ? 'md:w-full' : ''
            }`}
            ref={typeElRef}
            onClick={() => handleFiltersToggle('type')}
            selected={selectedType}
            isMd={isMd}
            label={typeLabel}
            isFiltersOpen={isFiltersOpen}
            handleChange={handleTypeChange}
            category={'type'}
          />
          <FilterSection
            className={`time-window filter-category ${
              isFiltersOpen('time') ? 'md:w-full' : ''
            }`}
            ref={timeElRef}
            onClick={() => handleFiltersToggle('time')}
            selected={selectedTimeWindow}
            isMd={isMd}
            label={timeWindowLabel}
            isFiltersOpen={isFiltersOpen}
            handleChange={handleTimeWindowChange}
            category={'time'}
          />
        </div>
      </div>
    </>
  );
};

export default FilterMovies;

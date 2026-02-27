import { useEffect, useState, useRef, useContext } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

import { useIsMd } from '@/shared/hooks/useIsMd';
import Backdrop from '../../ui/Backdrop';
import FilterSection from './FilterSection';
import filtersData from '@/shared/data/filters.json';
import MainScrollContext from '@/shared/context/MainScrollContext';

const FilterMovies = () => {
  const { pathname } = useLocation();
  const fetchType = pathname.startsWith('/discover/tv') ? 'tv' : 'movie';

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedLanguage, setSelectedLanguage] = useState(
    filtersData.languages.find(
      (l) => l.iso_639_1 === searchParams.get('with_original_language')
    )?.iso_639_1 || ''
  );
  const [selectedGenre, setSelectedGenre] = useState(
    (searchParams.get('with_genres')?.split(',').map(Number) || []).filter(
      (id) =>
        fetchType === 'movie'
          ? filtersData.genres.some((g) => g.id === id)
          : filtersData['tv-genres'].some((g) => g.id === id)
    )
  );
  const [selectedSort, setSelectedSort] = useState(
    filtersData.sorts.find((s) => s.value === searchParams.get('sort_by'))
      ?.value || ''
  );
  const [selectedMinRating, setSelectedMinRating] = useState(
    filtersData['min-rating'].some(
      (r) => r.label === searchParams.get('vote_average.gte')
    )
      ? searchParams.get('vote_average.gte')
      : ''
  );
  const [selectedMaxRating, setSelectedMaxRating] = useState(
    filtersData['max-rating'].some(
      (r) => r.label === searchParams.get('vote_average.lte')
    )
      ? searchParams.get('vote_average.lte')
      : ''
  );
  const [selectedYear, setSelectedYear] = useState(
    filtersData.years.some(
      (y) =>
        y.label ===
        (fetchType === 'movie'
          ? searchParams.get('primary_release_year')
          : searchParams.get('first_air_date_year'))
    )
      ? fetchType === 'movie'
        ? searchParams.get('primary_release_year')
        : searchParams.get('first_air_date_year')
      : ''
  );

  const isUpdatingFromState = useRef(false);

  useEffect(() => {
    if (isUpdatingFromState.current) return; // ignore if we triggered it

    const lang = searchParams.get('with_original_language');
    const genres = searchParams.get('with_genres');
    const sort = searchParams.get('sort_by');
    const min = searchParams.get('vote_average.gte');
    const max = searchParams.get('vote_average.lte');
    const year =
      fetchType === 'movie'
        ? searchParams.get('primary_release_year')
        : searchParams.get('first_air_date_year');

    setSelectedLanguage(lang || '');
    setSelectedGenre(genres ? genres.split(',').map(Number) : []);
    setSelectedSort(sort || '');
    setSelectedMinRating(min || '');
    setSelectedMaxRating(max || '');
    setSelectedYear(year || '');
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    selectedLanguage
      ? params.set('with_original_language', selectedLanguage)
      : params.delete('with_original_language');

    selectedGenre.length
      ? params.set('with_genres', selectedGenre.join(','))
      : params.delete('with_genres');

    selectedSort
      ? params.set('sort_by', selectedSort)
      : params.delete('sort_by');

    selectedMinRating
      ? params.set('vote_average.gte', selectedMinRating)
      : params.delete('vote_average.gte');

    selectedMaxRating
      ? params.set('vote_average.lte', selectedMaxRating)
      : params.delete('vote_average.lte');

    if (selectedYear) {
      fetchType === 'movie'
        ? params.set('primary_release_year', selectedYear)
        : params.set('first_air_date_year', selectedYear);
    } else {
      fetchType === 'movie'
        ? params.delete('primary_release_year')
        : params.delete('first_air_date_year');
    }

    // prevent infinite loop
    const newUrl = params.toString();
    if (newUrl !== searchParams.toString()) {
      isUpdatingFromState.current = true;
      setSearchParams(params);
      setTimeout(() => {
        isUpdatingFromState.current = false;
      }, 0);
    }
  }, [
    selectedLanguage,
    selectedGenre,
    selectedSort,
    selectedMinRating,
    selectedMaxRating,
    selectedYear,
  ]);

  const [showFilter, setShowFilter] = useState(true);

  // Handle changes
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };
  const handleGenreChange = (id) => {
    const genreId = id;
    setSelectedGenre((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };
  const handleSortChange = (e) => setSelectedSort(e.target.value);
  const handleMinRatingChange = (e) => setSelectedMinRating(e.target.value);
  const handleMaxRatingChange = (e) => setSelectedMaxRating(e.target.value);
  const handleYearChange = (e) => setSelectedYear(e.target.value);

  const langElRef = useRef();
  const genElRef = useRef();
  const sortElRef = useRef();
  const minRatingElRef = useRef();
  const maxRatingElRef = useRef();
  const yearElRef = useRef();

  // Language label
  const langLabel = selectedLanguage
    ? filtersData.languages.find((l) => l.iso_639_1 === selectedLanguage)
        ?.english_name || ''
    : '';

  // Genre labels
  const genreLabels =
    selectedGenre.length > 0
      ? fetchType === 'movie'
        ? filtersData.genres
            .filter((g) => selectedGenre.includes(g.id))
            .map((g) => g.name)
        : filtersData['tv-genres']
            .filter((g) => selectedGenre.includes(g.id))
            .map((g) => g.name)
      : [];

  const sortLabel = selectedSort
    ? filtersData.sorts.find((s) => s.value === selectedSort)?.label || ''
    : '';
  const minRatingLabel = selectedMinRating
    ? filtersData['min-rating'].find((r) => r.label === selectedMinRating)
        ?.label || ''
    : '';
  const maxRatingLabel = selectedMaxRating
    ? filtersData['max-rating'].find((r) => r.label === selectedMaxRating)
        ?.label || ''
    : '';
  const yearLabel = selectedYear
    ? filtersData.years.find((y) => y.label === selectedYear)?.label || ''
    : '';

  const isMd = useIsMd();

  const [open, setOpen] = useState({
    sort: false,
    language: false,
    genres: false,
    minRating: false,
    maxRating: false,
    year: false,
  });

  const handleFiltersToggle = (filterName) => {
    if (!isMd) {
      // Mobile: only one open at a time
      if (!filterName) return;
      setOpen((prev) => ({
        sort: false,
        language: false,
        genres: false,
        minRating: false,
        maxRating: false,
        year: false,
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
        !maxRatingElRef.current?.contains(e.target) &&
        !minRatingElRef.current?.contains(e.target) &&
        !sortElRef.current?.contains(e.target) &&
        !langElRef.current?.contains(e.target) &&
        !genElRef.current?.contains(e.target) &&
        !yearElRef.current?.contains(e.target)
      ) {
        // handleFiltersToggle(null);
        setOpen({
          sort: false,
          language: false,
          genres: false,
          minRating: false,
          maxRating: false,
          year: false,
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
                {langLabel && '🔹Language '}
                {genreLabels.length > 0 && '🔹Genre '}
                {sortLabel && '🔹Sort By'}
                {(minRatingLabel || maxRatingLabel) && '🔹Rating '}
                {yearLabel && '🔹Year'}
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
              isFiltersOpen('language') ? 'md:w-full' : ''
            }`}
            ref={langElRef}
            onClick={() => handleFiltersToggle('language')}
            selected={selectedLanguage}
            isMd={isMd}
            label={langLabel}
            isFiltersOpen={isFiltersOpen}
            handleChange={handleLanguageChange}
            category={'language'}
          />

          <FilterSection
            className={`genre filter-category ${
              isFiltersOpen('genres') ? 'md:w-full' : ''
            }`}
            ref={genElRef}
            onClick={() => handleFiltersToggle('genres')}
            selected={selectedGenre}
            isMd={isMd}
            label={genreLabels.length}
            isFiltersOpen={isFiltersOpen}
            handleChange={handleGenreChange}
            category={'genres'}
            genreLabels={genreLabels}
          />

          <FilterSection
            className={`sort filter-category ${
              isFiltersOpen('sort') ? 'md:w-full' : ''
            }`}
            ref={sortElRef}
            onClick={() => handleFiltersToggle('sort')}
            selected={selectedSort}
            isMd={isMd}
            label={sortLabel}
            isFiltersOpen={isFiltersOpen}
            handleChange={handleSortChange}
            category={'sort'}
          />

          <FilterSection
            className={`min-rating filter-category ${
              isFiltersOpen('minRating') ? 'md:w-full' : ''
            }`}
            ref={minRatingElRef}
            onClick={() => handleFiltersToggle('minRating')}
            selected={selectedMinRating}
            isMd={isMd}
            label={minRatingLabel}
            isFiltersOpen={isFiltersOpen}
            handleChange={handleMinRatingChange}
            category={'minRating'}
          />

          <FilterSection
            className={`max-rating filter-category ${
              isFiltersOpen('maxRating') ? 'md:w-full' : ''
            }`}
            ref={maxRatingElRef}
            onClick={() => handleFiltersToggle('maxRating')}
            selected={selectedMaxRating}
            isMd={isMd}
            label={maxRatingLabel}
            isFiltersOpen={isFiltersOpen}
            handleChange={handleMaxRatingChange}
            category={'maxRating'}
          />

          <FilterSection
            className={`year filter-category ${
              isFiltersOpen('year') ? 'md:w-full' : ''
            }`}
            ref={yearElRef}
            onClick={() => handleFiltersToggle('year')}
            selected={selectedYear}
            isMd={isMd}
            label={yearLabel}
            isFiltersOpen={isFiltersOpen}
            handleChange={handleYearChange}
            category={'year'}
          />
        </div>
      </div>
    </>
  );
};

export default FilterMovies;


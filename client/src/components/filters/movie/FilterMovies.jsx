// src/components/filters/FilterMovies.jsx
import { useEffect, useState, useRef, useContext } from 'react';
import {
  useNavigate,
  useLocation,
  useSearchParams,
  useParams,
} from 'react-router-dom';

import { useIsMd } from '../../../hooks/useIsMd';
import Backdrop from '../../ui/Backdrop';
import FilterSection from './FilterSection';
import filtersData from '../../../data/filters.json';
import MainScrollContext from '../../../context/MainScrollContext';

const allowedTypes = filtersData['movie-sorts'].map((t) => t.value);

export default function FilterMovies() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { mainRef } = useContext(MainScrollContext);
  const isMd = useIsMd();

  // ----------------------
  // Local state
  // ----------------------
  const [selectedMedia, setSelectedMedia] = useState('movie');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [selectedRegion, setSelectedRegion] = useState('US');

  // UI state
  const [showFilter, setShowFilter] = useState(true); // header toggle (mobile)
  const [open, setOpen] = useState({
    media: false,
    sort: false,
    region: false,
  });

  const mediaElRef = useRef(null);
  const sortElRef = useRef(null);
  const regionElRef = useRef(null);
  const ignoreScroll = useRef(false);

  // A small guard ref for redirect/update actions (keeps URL authoritative)
  const hasRedirectedInvalidType = useRef(false);

  // ----------------------
  // 1) On mount / when params.mediaType changes -> sync selectedType
  //    URL is authoritative for path; we only navigate when invalid.
  // ----------------------
  useEffect(() => {
    const urlParam = params.sort || 'popular';

    const segments = location.pathname.split('/').filter(Boolean);

    const extraSegments = segments.length > 2;
    const invalid = !allowedTypes.includes(urlParam) || extraSegments;

    if (invalid) {
      if (!hasRedirectedInvalidType.current) {
        hasRedirectedInvalidType.current = true;
        navigate('/movie/popular', { replace: true });
      } else {
        setSelectedSort('popular');
      }
      return;
    }

    if (selectedSort !== urlParam) {
      setSelectedSort(urlParam);
    }
    hasRedirectedInvalidType.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.sort, location.pathname, navigate]);

  // ----------------------
  // 2) On searchParams change -> sync selectedLanguage (URL authoritative for query)
  // ----------------------
  useEffect(() => {
    const region = searchParams.get('region') || 'US';
    if (region !== selectedRegion) {
      setSelectedRegion(region);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 3) Handlers: user changes type or region -> update URL (push) and local state
  // (User actions are the only place we write URL; effects read URL)
  const handleMediaChange = (e) => {
    const clickedMedia = e.target.value;
    if (clickedMedia === selectedMedia) return;
    setSelectedMedia(clickedMedia);
    navigate('/tv/popular');
  };
  const handleSortChange = (e) => {
    const clickedSort = e.target.value;
    if (clickedSort === selectedSort) return;

    setSelectedSort(clickedSort);
    // Push navigation for the type change, but keep the current region (language)
    const nextSearchParams = new URLSearchParams(searchParams);
    // only modify the type part of the URL
    navigate(`/movie/${clickedSort}?${nextSearchParams.toString()}`);
  };

  const handleRegionChange = (e) => {
    const clickedRegion = e.target.value || '';
    setSelectedRegion(clickedRegion);

    // Build new search params based on current searchParams
    const next = new URLSearchParams(searchParams);
    if (clickedRegion) next.set('region', clickedRegion);
    else next.delete('region');

    // Only set if changed
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next);
    }
  };

  // ----------------------
  // 4) showFilter & open UI logic (mobile vs desktop)
  // ----------------------
  useEffect(() => {
    if (isMd) {
      // Desktop: open all filters and show panel
      setOpen(Object.fromEntries(Object.keys(open).map((k) => [k, true])));
      setShowFilter(true);
    } else {
      // Mobile: collapse all by default
      setOpen(Object.fromEntries(Object.keys(open).map((k) => [k, false])));
      setShowFilter(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMd]);

  const handleFiltersToggle = (filterName) => {
    if (!isMd) {
      // mobile: only one open at a time
      setOpen((prev) => ({
        media: false,
        sort: false,
        region: false,
        [filterName]: !prev[filterName],
      }));
    } else {
      // desktop toggle independently
      setOpen((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
    }
  };

  // click outside to close (works for both desktop & mobile; mobile we keep behavior)
  useEffect(() => {
    const onDocClick = (e) => {
      const target = e.target;
      const clickedInsideMedia = mediaElRef.current?.contains(target);
      const clickedInsideSort = sortElRef.current?.contains(target);
      const clickedInsideRegion = regionElRef.current?.contains(target);
      // If neither filter contains the click, collapse mobile-only open panels
      if (
        !clickedInsideSort &&
        !clickedInsideRegion &&
        !clickedInsideMedia &&
        !isMd
      ) {
        setOpen({ media: false, sort: false, region: false });
      }
    };

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isMd]);

  // ----------------------
  // 5) lock main scroll when any mobile filter section is open
  // ----------------------
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

  // ----------------------
  // 6) auto-close filter panel on main scroll (mobile), with ignoreScroll guard
  // ----------------------
  useEffect(() => {
    const container = mainRef?.current;
    if (!container) return;

    const onScroll = () => {
      if (ignoreScroll.current) return; // ignore immediate clicks that toggled panel
      // on scroll -> close the showFilter panel (mobile)
      setShowFilter(false);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [isMd, mainRef]);

  const handleFilterHeadingClick = () => {
    ignoreScroll.current = true;
    setShowFilter((s) => !s);
    // small window to ignore the immediate scroll event resulting from tapping header
    setTimeout(() => {
      ignoreScroll.current = false;
    }, 120);
  };

  // ----------------------
  // 7) helper accessors
  // ----------------------
  const isFiltersOpen = (name) => !!open[name];
  const isAnyOpen = Object.values(open).some(Boolean);

  // labels
  const mediaLabel =
    filtersData['media'].find((t) => t.value === selectedMedia)?.label || '';
  const sortLabel =
    filtersData['movie-sorts'].find((t) => t.value === selectedSort)?.label ||
    '';
  const regionLabel = selectedRegion
    ? filtersData.regions.find((r) => r.value === selectedRegion)?.label || ''
    : '';

  // ----------------------
  // RENDER
  // ----------------------
  return (
    <>
      {/* Backdrop for mobile when any filter panel is open */}
      {isAnyOpen && (
        <Backdrop
          onClick={() => setOpen({ media: false, sort: false, region: false })}
          className="md:hidden z-30"
        />
      )}

      <div className="filters bg-primary text-primary p-2 pt-0 px-3 md:px-4 rounded-lg space-y-4 sticky top-0 z-40">
        <h1
          className={`filter-heading w-fit bg-accent-secondary p-2 rounded m-0 cursor-pointer`}
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
                {mediaLabel && <span className="mr-1">🔹{mediaLabel}</span>}
                {sortLabel && <span className="mr-1">🔹{sortLabel}</span>}
                {regionLabel && <span className="mr-1">🔹{regionLabel}</span>}
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
            className={`media filter-category ${
              isFiltersOpen('media') ? 'md:w-full' : ''
            }`}
            ref={mediaElRef}
            onClick={() => handleFiltersToggle('media')}
            selected={selectedMedia}
            isMd={isMd}
            label={mediaLabel}
            isFiltersOpen={isFiltersOpen}
            handleChange={handleMediaChange}
            category={'media'}
          />
          <FilterSection
            className={`sorts filter-category ${
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
            className={`regions filter-category ${
              isFiltersOpen('region') ? 'md:w-full' : ''
            }`}
            ref={regionElRef}
            onClick={() => handleFiltersToggle('region')}
            selected={selectedRegion}
            isMd={isMd}
            label={regionLabel}
            isFiltersOpen={isFiltersOpen}
            handleChange={handleRegionChange}
            category={'region'}
          />
        </div>
      </div>
    </>
  );
}

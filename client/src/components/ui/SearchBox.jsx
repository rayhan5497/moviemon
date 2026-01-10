import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from './Button';
import { useIsMd } from '@hooks/useIsMd.js';
import { X } from 'lucide-react';
import { Search } from 'lucide-react';

const SearchBox = ({ inMotion, setIsSearchOpen, isSearchOpen }) => {
  const inputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const isMd = useIsMd();

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = inputRef.current.value.trim();
    if (!value) return;
    const newQuery = encodeURIComponent(value);

    const currentQuery = new URLSearchParams(location.search).get('query');

    navigate(`/search?query=${newQuery}`, {
      replace: currentQuery === value,
    });
  };

  return (
    <div className="search-wrapper">
      {isMd || inMotion ? (
        <div className="search-in-desktop">
          <form
            onSubmit={handleSubmit}
            className={`block z-50 rounded-xl relative right-0 p-1 px-5 max-w-120 w-auto lg:w-[90vw] bg-gray-700`}
          >
            <div className="search-input-btn-wrapper flex items-center mr-[30px]">
              <input
                ref={inputRef}
                type="text"
                id="searchInput"
                className="outline-0 w-full h-11 text-xl md:text-2xl rounded text-white"
                placeholder="What you like to watch..."
                aria-label="Search for movies"
              />

              <button
                to={'/search'}
                className="absolute right-0 p-[0.9em] pl-[1.2em] hover:border-l-1 border-accent-secondary opacity-70 hover:opacity-90 cursor-pointer hover:bg-black/10 rounded-xl"
                type="submit"
              >
                <Search
                  className={`text-white opacity-70 hover:opacity-80 cursor-pointer w-8 p-0 z-20`}
                  size={24}
                  strokeWidth={3}
                  role="button"
                />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="search-in-mobile">
          <form
            onSubmit={(e) => {
              handleSubmit(e);
              setIsSearchOpen((prev) => !prev);
            }}
            className={`${
              isSearchOpen ? 'block' : 'hidden'
            } z-50 rounded-xl fixed right-0 p-2 px-5 max-w-120 top-15 w-[90vw] m-5 bg-gray-700`}
          >
            <div className="search-input-btn-wrapper flex items-center mr-[30px]">
              <input
                ref={inputRef}
                type="text"
                id="searchInput"
                className="outline-0 w-full h-11 text-xl md:text-2xl rounded text-white"
                placeholder="What you like to watch..."
                aria-label="Search for movies"
              />

              <button
                to={'/search'}
                className="absolute right-0 p-[1.1em] pl-[1.4em] hover:border-l-1 border-accent-secondary opacity-70 hover:opacity-90 cursor-pointer hover:bg-black/10 rounded-xl"
                type="submit"
              >
                <Search
                  className={`text-white opacity-70 hover:opacity-80 cursor-pointer w-8 p-0 z-20`}
                  size={24}
                  strokeWidth={3}
                  role="button"
                />
              </button>
            </div>
          </form>
          <Button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`border border-white/70 opacity-70 hover:opacity-80 bg-transparent h-10 rounded-xl py-1 px-2 w-auto cursor-pointer ${
              isSearchOpen ? 'z-50' : 'z-0'
            }`}
          >
            {isSearchOpen ? (
              <X
                className={`text-white opacity-70 hover:opacity-80 cursor-pointer w-8 p-0 z-20`}
                size={24}
                strokeWidth={3}
                role="button"
              />
            ) : (
              <Search
                className={`text-white opacity-70 hover:opacity-80 cursor-pointer w-8 p-0 z-20`}
                size={24}
                strokeWidth={3}
                role="button"
              />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchBox;

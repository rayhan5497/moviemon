import filtersData from '@/shared/data/filters.json';
import React from 'react';
import { useLocation } from 'react-router-dom';

const FilterSection = React.forwardRef((props, ref) => {
  const { pathname } = useLocation();
  const fetchType = pathname.startsWith('/tv') ? 'tv' : 'movie';

  const categoryNames = {
    language: 'Language',
    genres: 'Genre',
    sort: 'Sort By',
    minRating: 'Minimum Rating',
    maxRating: 'Maximum Rating',
    year: 'Year',
  };

  const getCategoryName = () => categoryNames[props.category] || '';

  return (
    <div className={`${props.className} truncate`}>
      <div className={`lang-btn-wrapper md:flex items-baseline`} ref={ref}>
        <button
          onClick={props.onClick}
          className={`category-btn cursor-pointer w-full border-accent-secondary rounded p-1 pl-3 flex justify-between items-center md:w-auto ${
            props.selected.length > 0 ? 'text-accent' : 'text-secondary'
          }`}
        >
          <span className="text-nowrap font-light md:font-semibold truncate">
            {!props.isMd ? (
              props.label ? (
                <>
                  <span className="font-semibold"> {getCategoryName()} : </span>
                  {typeof props.label === 'string'
                    ? props.label
                    : props.genreLabels.join(' / ')}
                </>
              ) : (
                getCategoryName()
              )
            ) : (
              getCategoryName()
            )}
          </span>
          <span>{props.isFiltersOpen(props.category) ? '🔺' : '🔻'}</span>
        </button>

        {props.category === 'language' &&
          props.isFiltersOpen(props.category) && (
            <div className="label-wrapper w-full p-1 gap-2 border border-accent-secondary rounded text-primary bg-primary z-50 absolute max-h-[50vh] overflow-x-hidden overflow-scroll left-0 right-0 md:flex md:flex-wrap md:relative md:h-36 md:overflow-auto md:border-0 md:gap-0 md:p-0">
              {filtersData.languages.map((lang) => (
                <label key={lang.iso_639_1} className="cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value={lang.iso_639_1}
                    className="hidden peer"
                    checked={props.selected === lang.iso_639_1}
                    onChange={(e) => {
                      props.handleChange(e);
                    }}
                  />
                  <span className=" block px-3 py-1 rounded bg-accent-secondary text-primary transition peer-checked:bg-checked border border-accent-secondary mx-1 my-2 md:m-0 md:border-0 hover:bg-gray-300">
                    {lang.english_name}
                  </span>
                </label>
              ))}
            </div>
          )}

        {props.category === 'genres' && props.isFiltersOpen(props.category) && (
          <div className="label-wrapper p-1 gap-[5px] border border-accent-secondary rounded bg-primary text-primary z-50 absolute max-h-[50vh] overflow-x-hidden overflow-scroll left-0 right-0 md:flex md:flex-wrap md:relative md:border-0 md:p-0">
            {(fetchType === 'movie'
              ? filtersData.genres
              : filtersData['tv-genres']
            ).map((gen) => (
              <label key={gen.id} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="genre"
                  value={gen.id}
                  className="hidden peer"
                  checked={props.selected.includes(gen.id)}
                  onChange={() => {
                    props.handleChange(gen.id);
                  }}
                />
                <span className=" block px-3 py-1 rounded bg-accent-secondary text-primary transition peer-checked:bg-checked border border-accent-secondary mx-1 my-2 md:m-0 md:border-0 hover:bg-gray-300">
                  {gen.name}
                </span>
              </label>
            ))}
          </div>
        )}

        {props.category === 'sort' && props.isFiltersOpen(props.category) && (
          <div className="label-wrapper p-1 gap-2 border border-accent-secondary rounded text-primary bg-primary z-50 absolute max-h-[50vh] overflow-x-hidden overflow-scroll left-0 right-0 md:flex md:flex-wrap md:relative md:overflow-auto md:border-0 md:gap-0 md:p-0">
            {filtersData.sorts.map((sort) => (
              <label key={sort.label} className="cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value={sort.value}
                  className="hidden peer"
                  checked={props.selected === sort.value}
                  onChange={(e) => {
                    props.handleChange(e);
                  }}
                />
                <span className=" block px-3 py-1 rounded bg-accent-secondary text-primary transition peer-checked:bg-checked border border-accent-secondary mx-1 my-2 md:m-0 md:border-0 hover:bg-gray-300">
                  {sort.label}
                </span>
              </label>
            ))}
          </div>
        )}

        {props.category === 'minRating' &&
          props.isFiltersOpen(props.category) && (
            <div className="label-wrapper p-1 gap-2 border border-accent-secondary rounded text-primary bg-primary z-50 absolute max-h-[50vh] overflow-x-hidden overflow-scroll left-0 right-0 md:flex md:flex-wrap md:relative md:overflow-auto md:border-0 md:gap-0 md:p-0">
              {filtersData['min-rating'].map((rating) => (
                <label key={rating.label} className="cursor-pointer">
                  <input
                    type="radio"
                    name="minRating"
                    value={rating.value}
                    className="hidden peer"
                    checked={props.selected === rating.value.toString()}
                    onChange={(e) => {
                      props.handleChange(e);
                    }}
                  />
                  <span className=" block px-3 py-1 rounded bg-accent-secondary text-primary transition peer-checked:bg-checked border border-accent-secondary mx-1 my-2 md:m-0 md:border-0 hover:bg-gray-300">
                    {rating.label}
                  </span>
                </label>
              ))}
            </div>
          )}

        {props.category === 'maxRating' &&
          props.isFiltersOpen(props.category) && (
            <div className="label-wrapper p-1 gap-2 border border-accent-secondary rounded text-primary bg-primary z-50 absolute max-h-[50vh] overflow-x-hidden overflow-scroll left-0 right-0 md:flex md:flex-wrap md:relative md:overflow-auto md:border-0 md:gap-0 md:p-0">
              {filtersData['max-rating'].map((rating) => (
                <label key={rating.label} className="cursor-pointer">
                  <input
                    type="radio"
                    name="maxRating"
                    value={rating.value}
                    className="hidden peer"
                    checked={props.selected === rating.value.toString()}
                    onChange={(e) => {
                      props.handleChange(e);
                    }}
                  />
                  <span className=" block px-3 py-1 rounded bg-accent-secondary text-primary transition peer-checked:bg-checked border border-accent-secondary mx-1 my-2 md:m-0 md:border-0 hover:bg-gray-300">
                    {rating.label}
                  </span>
                </label>
              ))}
            </div>
          )}

        {props.category === 'year' && props.isFiltersOpen(props.category) && (
          <div className="label-wrapper p-1 gap-2 border border-accent-secondary rounded text-primary bg-primary z-50 absolute max-h-[50vh] overflow-x-hidden overflow-scroll left-0 right-0 md:flex md:flex-wrap md:relative md:overflow-auto md:border-0 md:gap-0 md:p-0">
            {filtersData.years.map((year) => (
              <label key={year.label} className="cursor-pointer">
                <input
                  type="radio"
                  name="year"
                  value={year.value}
                  className="hidden peer"
                  checked={props.selected === year.value.toString()}
                  onChange={(e) => {
                    props.handleChange(e);
                  }}
                />
                <span className=" block px-3 py-1 rounded bg-accent-secondary text-primary transition peer-checked:bg-checked border border-accent-secondary mx-1 my-2 md:m-0 md:border-0 hover:bg-gray-300">
                  {year.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default FilterSection;


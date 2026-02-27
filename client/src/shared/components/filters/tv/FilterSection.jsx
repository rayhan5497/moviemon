import { NavLink } from 'react-router-dom';
import filtersData from '@/shared/data/filters.json';
import React from 'react';

const FilterSection = React.forwardRef((props, ref) => {
  const categoryNames = {
    media: 'Media',
    sort: 'Sort By',
    timezone: 'Time Zone',
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
                  {props.label}
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

        {props.category === 'media' && props.isFiltersOpen(props.category) && (
          <div className="label-wrapper w-full p-1 gap-2 border border-accent-secondary rounded text-primary bg-primary z-50 absolute max-h-[50vh] overflow-x-hidden overflow-scroll left-0 right-0 md:flex md:flex-wrap md:relative md:border-0 md:gap-0 md:p-0">
            {filtersData['media'].map((t) => (
              <label key={t.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="media"
                  value={t.value}
                  className="hidden peer"
                  checked={props.selected === t.value}
                  onChange={(e) => {
                    props.handleChange(e);
                  }}
                />
                <span className=" block px-3 py-1 rounded bg-accent-secondary text-primary transition peer-checked:bg-checked border border-accent-secondary mx-1 my-2 md:m-0 md:border-0 hover:bg-gray-300">
                  {t.label}
                </span>
              </label>
            ))}
          </div>
        )}
        {props.category === 'sort' && props.isFiltersOpen(props.category) && (
          <div className="label-wrapper w-full p-1 gap-2 border border-accent-secondary rounded text-primary bg-primary z-50 absolute max-h-[50vh] overflow-x-hidden overflow-scroll left-0 right-0 md:flex md:flex-wrap md:relative md:border-0 md:gap-0 md:p-0">
            {filtersData['tv-sorts'].map((t) => (
              <label key={t.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="media-type"
                  value={t.value}
                  className="hidden peer"
                  checked={props.selected === t.value}
                  onChange={(e) => {
                    props.handleChange(e);
                  }}
                />
                <span className=" block px-3 py-1 rounded bg-accent-secondary text-primary transition peer-checked:bg-checked border border-accent-secondary mx-1 my-2 md:m-0 md:border-0 hover:bg-gray-300">
                  {t.label}
                </span>
              </label>
            ))}
          </div>
        )}
        {props.category === 'timezone' &&
          props.isFiltersOpen(props.category) && (
            <div className="label-wrapper w-full p-1 gap-2 border border-accent-secondary rounded text-primary bg-primary z-50 absolute max-h-[50vh] overflow-x-hidden overflow-scroll left-0 right-0 md:flex md:flex-wrap md:relative md:border-0 md:gap-0 md:p-0">
              {filtersData.timezones.map((l) => (
                <label key={l.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="timezone"
                    value={l.value}
                    className="hidden peer"
                    checked={props.selected === l.value}
                    onChange={(e) => {
                      props.handleChange(e);
                    }}
                  />
                  <span className=" block px-3 py-1 rounded bg-accent-secondary text-primary transition peer-checked:bg-checked border border-accent-secondary mx-1 my-2 md:m-0 md:border-0 hover:bg-gray-300">
                    {l.label}
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


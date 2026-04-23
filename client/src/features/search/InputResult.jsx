import { NavLink } from 'react-router-dom';

const InputResult = ({ data, isLoading, onResultClick }) => {

  const detailsDescriptor = ['Year', 'Rating'];

  return (
    <div className="result absolute top-13 left-0 w-full">
      {data.length > 0 && (
        <div className="bg-secondary rounded-xl p-2 text-sm max-h-60 overflow-y-auto">
          {data
            .filter(Boolean)
            .filter((result) => result.poster_path)
            .sort(
              (a, b) =>
                b.vote_count - a.vote_count || b.popularity - a.popularity
            )
            .map((result) => (
              <NavLink
                to={`/player/${result.media_type}/${result.id}`}
                key={result.id}
                className="flex items-center gap-2 p-1 hover:bg-accent-hover rounded cursor-pointer"
                onClick={onResultClick}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w45/${result.poster_path}`}
                  alt={result.title || result.name}
                  className="w-12 h-16 rounded"
                />
                <div className="details p-1 truncate">
                  <div className="title text-accent font-medium truncate">
                    {result.title || result.name}
                  </div>
                  <div className="year-and-rating text-secondary text-sm">
                    {detailsDescriptor.map((descriptor) => {
                      let value = 'N/A';

                      if (descriptor === 'Year') {
                        value =
                          result.release_date?.split('-')[0] ||
                          result.first_air_date?.split('-')[0] ||
                          'N/A';
                      } else if (descriptor === 'Rating') {
                        value = result.vote_average?.toFixed(1) ?? 'N/A';
                      }

                      return (
                        <div
                          key={descriptor}
                          className="font-normal text-primary grid grid-cols-2 gap-5 w-30"
                        >
                          <span className="opacity-70">{descriptor}: </span>
                          <span className="opacity-80">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </NavLink>
            ))}
        </div>
      )}
      {isLoading && (
        <div className="bg-secondary rounded-xl p-2 text-sm max-h-60 overflow-y-auto">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-1 hover:bg-accent-hover rounded cursor-pointer opacity-50"
            >
              <div className="w-12 h-16 rounded bg-gray-500 animate-pulse" />
              <div className="details p-1 flex gap-2 flex-col">
                <div className="title rounded w-30 h-4 text-accent font-medium truncate bg-gray-500 animate-pulse" />
                <span className="opacity-70 rounded w-16 h-3 bg-gray-500 animate-pulse"></span>
                <span className="opacity-80 rounded w-16 h-3 bg-gray-500 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputResult;

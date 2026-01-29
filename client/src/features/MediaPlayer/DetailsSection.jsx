import filtersData from '@data/filters';

const DetailsSection = ({ media, className }) => {
  const description = media?.overview;
  const genre = filtersData.genres
    .filter((g) => media?.genres?.some((mg) => mg.id === g.id))
    .map((g) => g.name)
    .join(', ');
  const language = filtersData.languages.find(
    (l) => l.iso_639_1 === media?.original_language
  )?.english_name;
  const status = media?.status;

  return (
    <div className={`details relative flex flex-col gap-1 font-light ${className}`}>
      <p
        className={`description leading-5 ${
          description ? 'opacity-80' : 'opacity-60'
        }`}
      >
        {description ? description : 'No Descripton !'}
      </p>
      <div className="genre">
        <span className="title opacity-80">Genre: </span>
        <span className={`${genre ? 'opacity-100' : 'opacity-60'}`}>
          {genre ? genre : 'N/A'}
        </span>
      </div>
      <div className="language">
        <span className="title opacity-80">Language: </span>
        <span className={`${language ? 'opacity-100' : 'opacity-60'}`}>
          {language ? language : 'N/A'}
        </span>
      </div>
      <div className="status">
        <span className="title opacity-80">Status: </span>
        <span className={`${status ? 'opacity-100' : 'opacity-60'}`}>
          {status ? status : 'N/A'}
        </span>
      </div>
    </div>
  );
};

export default DetailsSection;

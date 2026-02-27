const HighLightSection = ({ media, className='' }) => {
  const rating = media?.vote_average;
  const voteCount = media?.vote_count;

  return (
    <div
      className={`highlight w-full items-center flex flex-col justify-center rounded text-nowrap gap-2 ${
        rating <= 0 ? 'opacity-60' : 'opacity-90'
      } ${className}`}
    >
      <div
        className={`rating-wrapper md:text-3xl ${
          rating ? 'opacity-90' : 'opacity-60'
        }`}
      >
        <span className="text-3xl md:text-5xl">
          <span className="text-amber-300 text-4xl md:text-5xl">⭐</span>
          <span className="rating font-bold">{rating ? rating.toFixed(1) : 'N/A'}</span>
        </span>
        <span className="divider"> / </span>
        <span className="rating-out">10</span>
      </div>
      <div
        className={`rated-by text-sm md:text-xl font-light ${
          voteCount ? 'opacity-90' : 'opacity-60'
        }`}
      >
        {voteCount ? voteCount + ' people rated' : 'No rating'}
      </div>
      {/* <div className="network border-1 border-white/50 rounded-full h-20 w-20 p-3 content-center">
              <img
                id="networkLogo"
                className=""
                src={`https://image.tmdb.org/t/p/w92${
                  networkLogoPath
                }`}
              
              />
            </div> */}
    </div>
  );
};

export default HighLightSection;

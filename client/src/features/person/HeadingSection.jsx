import formatRating from '@/shared/utils/formatRating';

const HeadingSection = ({ person }) => {
  const popularity = person?.popularity;
  const birthDay = person?.birthday;
  const deathDay = person?.deathday;

  return (
    <div className="heading-container gap-1 flex flex-col">
      <div className="heading-data inline-flex opacity-90 font-semibold md:text-lg justify-center md:justify-start gap-2 flex-wrap leading-none">
        <span className="text-accent opacity-70">
          <span>⭐ </span>
          {popularity ? formatRating(popularity) : 'N/A'}
        </span>

        {birthDay && !deathDay && (
          <div className="wrapper opacity-70">
            <span className="divider"> 󠁯•󠁏 </span>
            <span className="birthday">{new Date(birthDay).getFullYear()}</span>
          </div>
        )}
        {birthDay && deathDay && (
          <div className="wrapper opacity-70">
            <span className="divider"> •󠁏 </span>
            <span className="birthday">{new Date(birthDay).getFullYear()}</span>
            <span> - </span>
            <span className="deathday">{new Date(deathDay).getFullYear()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadingSection;


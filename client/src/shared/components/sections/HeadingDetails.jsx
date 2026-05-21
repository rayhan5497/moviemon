import { RiMovie2AiLine } from 'react-icons/ri';
import { BiTv } from 'react-icons/bi';
import { CountryFlag, CountryName } from '../ui/Country';
import isValidCountryCode from '@/shared/utils/checkCountryCode';
import { getMediaRating } from '@/shared/utils/mediaRatings';
import getRatingColor from '@/shared/utils/ratingColor';

const HeadingSection = ({ media, className }) => {
  const mediaType = media?.title ? 'movie' : 'tv';

  const rating = getMediaRating(media);
  const date = media?.release_date || media?.first_air_date;
  const countryCode = media?.origin_country ? media?.origin_country[0] : null;
  const rated =
    media?.release_dates?.results?.find((r) => r.iso_3166_1 === countryCode)
      ?.release_dates?.[0]?.certification ||
    media?.content_ratings?.results?.find((r) => r.iso_3166_1 === countryCode)
      ?.rating ||
    '';
  const ratingColor = getRatingColor(rating);

  return (
    <div className="heading-data inline-flex opacity-70 md:text-lg items-center gap-2 flex-wrap leading-none">
      {rated && (
        <>
          {mediaType === 'movie' ? (
            <>
              <RiMovie2AiLine /> <span>{rated}</span>
            </>
          ) : (
            <>
              <BiTv />
              <span>{rated}</span>
            </>
          )}
          <span className="divider">∣</span>
        </>
      )}

      <span className={`${ratingColor} font-semibold ${className}`}>
        <span>★ </span>
        {rating ? rating.toFixed(1) : 'N/A'}
      </span>
      {date && (
        <>
          <span className="divider">∣</span>
          <span>🎬 {date ? new Date(date).getFullYear() : 'N/A'}</span>
        </>
      )}
      {countryCode && isValidCountryCode(countryCode) && (
        <div className="country-wrapper flex gap-2 items-center">
          <span className="divider">∣</span>
          <span className="name-and-flag-wrapper flex items-center gap-1">
            <CountryFlag code={countryCode} />
            <CountryName code={countryCode} />
          </span>
        </div>
      )}
    </div>
  );
};

export default HeadingSection;

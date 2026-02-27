import ReactCountryFlag from 'react-country-flag';
import  isValidCountryCode  from '@utils/checkCountryCode';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

function CountryFlag({ code, style, ...props }) {
  const normalized = code?.toUpperCase();

  if (!isValidCountryCode(normalized)) return null;

  return (
    <ReactCountryFlag
      countryCode={normalized}
      svg
      style={{ width: '1em', height: '1em', ...style }}
      {...props}
    />
  );
}

function CountryName({ code }) {
  const normalized = code?.toUpperCase();

  if (!isValidCountryCode(normalized)) return null;

  return <>{regionNames.of(normalized)}</>;
}

export { CountryFlag, CountryName };
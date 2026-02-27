const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export default function isValidCountryCode(code) {
  if (typeof code !== 'string') return false;

  const normalized = code.toUpperCase();

  if (!/^[A-Z]{2}$/.test(normalized)) return false;

  return regionNames.of(normalized) !== undefined;
}

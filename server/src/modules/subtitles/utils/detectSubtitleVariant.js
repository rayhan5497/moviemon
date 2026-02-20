function detectVariant(name = '') {
  const n = name.toLowerCase();
  if (/(uhd|2160p|4k)/.test(n)) return 'UHD';
  if (/remux/.test(n)) return 'REMUX';
  if (/bluray|blu-ray|bdrip|bd-rip/.test(n)) return 'BluRay';
  if (/brrip/.test(n)) return 'BRRip';
  if (/web[-_. ]?dl/.test(n)) return 'WEB-DL';
  if (/webrip/.test(n)) return 'WEBRip';
  if (/web/.test(n)) return 'WEB';
  if (/hdtv/.test(n)) return 'HDTV';
  if (/pdtv/.test(n)) return 'PDTV';
  if (/(dtv|dsr)/.test(n)) return 'DTV';
  if (/dvdrip/.test(n)) return 'DVDRip';
  if (/dvd/.test(n)) return 'DVD';
  if (/(hdrip|hd-rip)/.test(n)) return 'HDRip';
  if (/(ts|telesync)/.test(n)) return 'TS';
  if (/(tc|telecine)/.test(n)) return 'TC';
  if (/(cam|hdcam)/.test(n)) return 'CAM';
  if (/(scr|screener)/.test(n)) return 'SCR';
  return 'Unknown';
}

module.exports = detectVariant;

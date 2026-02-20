async function convertSrtToVtt(srt) {
  return (
    'WEBVTT\n\n' +
    srt
      .replace(/\r+/g, '')
      .replace(/^\d+\n/gm, '')
      .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')
  );
}

module.exports = convertSrtToVtt;

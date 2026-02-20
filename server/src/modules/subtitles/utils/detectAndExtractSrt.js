const unzipper = require('unzipper')

async function detectAndExtractSrt(buffer) {
  const magic = buffer.slice(0, 4).toString('hex');
  if (magic.startsWith('1f8b')) return zlib.gunzipSync(buffer).toString('utf8');
  if (magic === '504b0304') {
    const zip = await unzipper.Open.buffer(buffer);
    return (await zip.files[0].buffer()).toString('utf8');
  }
  return buffer.toString('utf8');
}

module.exports = detectAndExtractSrt;
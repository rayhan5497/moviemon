import adultRegex from './provideRegex'

export default function verifyAdultQuery(query) {
  const text = query;

  const matches = [...text.matchAll(adultRegex())];

  if (matches.length > 0) {
    matches.forEach((match) => {
      const standaloneKeyword = match[1] || null;
      const descriptor = match[3] || null;
      const descriptorKeyword = match[4] || null;
      console.log(
        `Adult Keyword:${query}, Matches With> Descriptor: ${descriptor}, Keyword: ${descriptorKeyword}, Standalone Keyword: ${standaloneKeyword},`
      );
    });
  }

  return matches.length > 0 ? true : false;
}

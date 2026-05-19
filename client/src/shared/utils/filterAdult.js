import adultRegex from './provideRegex';

export default async function filterAdult(data) {
  let allowFilter = true;
  if (!allowFilter) return data;
  if (!data.results) return data;
  let movieSkipped = [];
  let filteredMovies = [];
  const movies = data.results;
  for (const movie of movies) {
    if (movie.adult === true) {
      console.warn(
        'adult movie',
        movie.adult,
        'name',
        movie.title || movie.name,
        movie
      );
      movieSkipped.push(movie);
      continue;
    }

    const text = movie.title
      ? movie.title + ' ' + movie.overview
      : movie.name + ' ' + movie.overview;
    const matches = [...text.matchAll(adultRegex())];

    if (matches.length > 0) {
      matches.forEach((match) => {
        const standaloneKeyword = match[1] || null;
        const descriptor = match[3] || null;
        const descriptorKeyword = match[4] || null;
        console.log(
          `adult movie, skipping > reason: Descriptor: ${descriptor}, Keyword: ${descriptorKeyword}, Standalone Keyword: ${standaloneKeyword}, 'Name:',
                ${movie.title || movie.name}`
        );
      });

      movieSkipped.push(movie);
      continue;
    }

    filteredMovies.push(movie);
  }

  // filteredMovies.push(...movieSkipped)
  console.log('skippedMovies', movieSkipped.length);
  console.log('passedMovie', filteredMovies.length);

  let finalData = {
    page: data.page,
    results: filteredMovies,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };

  return finalData;
}

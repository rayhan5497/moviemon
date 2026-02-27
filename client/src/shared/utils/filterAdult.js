import adultRegex from './provideRegex';

export default async function filterAdult(data) {
  let allowFilter = true;
  if (!allowFilter) return data;
  if (!data.results) return data;
  let movieSkipped = 0;
  let passedMovie = 0;
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
      movieSkipped++;
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

      movieSkipped++;
      continue;
    }

    filteredMovies.push(movie);
    passedMovie++;
  }
  console.log('skippedMovies', movieSkipped);
  console.log('passedMovie', passedMovie);

  let finalData = {
    page: data.page,
    results: filteredMovies,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };

  return finalData;
}

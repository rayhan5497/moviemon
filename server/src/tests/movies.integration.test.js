process.env.NODE_ENV = 'test';
process.env.MOVIES_API_BASE_URL = 'https://api.themoviedb.org/3';
process.env.MOVIES_API_KEY = 'tmdb-test-key';
process.env.IMDB_RATINGS_DATASET_URL =
  'https://datasets.imdbws.com/title.ratings.tsv.gz';
process.env.IMDB_SYNC_ENABLED = 'false';
process.env.IMDB_ENRICHMENT_ENABLED = 'true';

const fs = require('fs');
const mongoose = require('mongoose');
const os = require('os');
const path = require('path');
const zlib = require('zlib');
const datasetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'moviemon-imdb-'));
const datasetPath = path.join(datasetDir, 'title.ratings.tsv.gz');
process.env.IMDB_RATINGS_DATASET_PATH = datasetPath;

const MediaExternalMapping = require('../modules/movies/mediaExternalMapping.model');
const { fetchMovies } = require('../modules/movies/movies.integration');
const { syncMovieMappings } = require('../modules/movies/movies.sync');

const jsonResponse = (body, overrides = {}) =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => body,
    ...overrides,
  });

const binaryResponse = (buffer, overrides = {}) =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    arrayBuffer: async () => buffer,
    ...overrides,
  });

const toUrlString = (input) =>
  typeof input === 'string' ? input : input.toString();

const buildDataset = (rows) =>
  zlib.gzipSync(
    ['tconst\taverageRating\tnumVotes', ...rows]
      .join('\n')
      .concat('\n')
  );

describe('movies integration', () => {
  let mappingStore = [];
  let originalReadyState;
  let originalFind;
  let originalFindOne;
  let originalCreate;
  let originalDeleteMany;
  let originalBulkWrite;

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const matches = (doc, query = {}) => {
    if (!query || Object.keys(query).length === 0) {
      return true;
    }

    if (Array.isArray(query.$or)) {
      return query.$or.some((condition) => matches(doc, condition));
    }

    return Object.entries(query).every(([key, value]) => doc[key] === value);
  };

  beforeAll(() => {
    originalReadyState = mongoose.connection.readyState;
    originalFind = MediaExternalMapping.find;
    originalFindOne = MediaExternalMapping.findOne;
    originalCreate = MediaExternalMapping.create;
    originalDeleteMany = MediaExternalMapping.deleteMany;
    originalBulkWrite = MediaExternalMapping.bulkWrite;

    mongoose.connection.readyState = 1;

    MediaExternalMapping.find = jest.fn((query = {}) => ({
      lean: async () => mappingStore.filter((doc) => matches(doc, query)).map(clone),
    }));

    MediaExternalMapping.findOne = jest.fn((query = {}) => ({
      lean: async () => {
        const doc = mappingStore.find((item) => matches(item, query));
        return doc ? clone(doc) : null;
      },
    }));

    MediaExternalMapping.create = jest.fn(async (doc) => {
      const next = clone(doc);
      mappingStore.push(next);
      return next;
    });

    MediaExternalMapping.deleteMany = jest.fn(async (query = {}) => {
      if (!query || Object.keys(query).length === 0) {
        mappingStore = [];
        return;
      }

      mappingStore = mappingStore.filter((doc) => !matches(doc, query));
    });

    MediaExternalMapping.bulkWrite = jest.fn(async (operations) => {
      operations.forEach(({ updateOne }) => {
        const { filter, update, upsert } = updateOne;
        let existing = mappingStore.find((doc) => matches(doc, filter));

        if (!existing && !upsert) {
          return;
        }

        if (!existing) {
          existing = clone(filter);
          mappingStore.push(existing);
        }

        if (update.$set) {
          Object.assign(existing, clone(update.$set));
        }
      });
    });
  });

  beforeEach(() => {
    mappingStore = [];
    fs.rmSync(datasetPath, { force: true });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  afterAll(() => {
    mongoose.connection.readyState = originalReadyState;
    MediaExternalMapping.find = originalFind;
    MediaExternalMapping.findOne = originalFindOne;
    MediaExternalMapping.create = originalCreate;
    MediaExternalMapping.deleteMany = originalDeleteMany;
    MediaExternalMapping.bulkWrite = originalBulkWrite;
    fs.rmSync(datasetDir, { recursive: true, force: true });
  });

  it('adds IMDb rating fields while preserving TMDb rating fields', async () => {
    const datasetBuffer = buildDataset(['tt0137523\t8.8\t2400001']);

    global.fetch.mockImplementation((input) => {
      const url = toUrlString(input);

      if (url.includes('/movie/550?api_key=tmdb-test-key')) {
        return jsonResponse({
          id: 550,
          title: 'Fight Club',
          vote_average: 8.4,
          vote_count: 28765,
        });
      }

      if (url.includes('/movie/550/external_ids?api_key=tmdb-test-key')) {
        return jsonResponse({ imdb_id: 'tt0137523' });
      }

      if (url === process.env.IMDB_RATINGS_DATASET_URL) {
        return binaryResponse(datasetBuffer);
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    });

    const result = await fetchMovies('/movie/550');
    const mapping = await MediaExternalMapping.findOne({
      tmdbId: 550,
      mediaType: 'movie',
    }).lean();

    expect(result).toMatchObject({
      id: 550,
      title: 'Fight Club',
      imdb_id: 'tt0137523',
      imdb_rating: 8.8,
      imdb_vote_count: 2400001,
      vote_average: 8.4,
      vote_count: 28765,
    });
    expect(mapping).toMatchObject({
      tmdbId: 550,
      mediaType: 'movie',
      imdbId: 'tt0137523',
      imdbRating: 8.8,
      imdbVoteCount: 2400001,
    });
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('enriches search results for movie and tv items while leaving people untouched', async () => {
    const datasetBuffer = buildDataset([
      'tt0133093\t8.7\t2100000',
      'tt0903747\t9.5\t2300000',
    ]);

    global.fetch.mockImplementation((input) => {
      const url = toUrlString(input);

      if (url.includes('/search/multi?query=matrix&api_key=tmdb-test-key')) {
        return jsonResponse({
          page: 1,
          total_pages: 1,
          results: [
            {
              id: 603,
              media_type: 'movie',
              title: 'The Matrix',
              vote_average: 8.2,
              vote_count: 21000,
            },
            {
              id: 1396,
              media_type: 'tv',
              name: 'Breaking Bad',
              first_air_date: '2008-01-20',
              vote_average: 8.5,
              vote_count: 13000,
            },
            {
              id: 287,
              media_type: 'person',
              name: 'Brad Pitt',
            },
          ],
        });
      }

      if (url.includes('/movie/603/external_ids?api_key=tmdb-test-key')) {
        return jsonResponse({ imdb_id: 'tt0133093' });
      }

      if (url.includes('/tv/1396/external_ids?api_key=tmdb-test-key')) {
        return jsonResponse({ imdb_id: 'tt0903747' });
      }

      if (url === process.env.IMDB_RATINGS_DATASET_URL) {
        return binaryResponse(datasetBuffer);
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    });

    const result = await fetchMovies('/search/multi?query=matrix');

    expect(result.results[0]).toMatchObject({
      id: 603,
      media_type: 'movie',
      imdb_id: 'tt0133093',
      imdb_rating: 8.7,
      imdb_vote_count: 2100000,
      vote_average: 8.2,
      vote_count: 21000,
    });
    expect(result.results[1]).toMatchObject({
      id: 1396,
      media_type: 'tv',
      imdb_id: 'tt0903747',
      imdb_rating: 9.5,
      imdb_vote_count: 2300000,
      vote_average: 8.5,
      vote_count: 13000,
    });
    expect(result.results[2]).toEqual({
      id: 287,
      media_type: 'person',
      name: 'Brad Pitt',
    });
    expect(global.fetch).toHaveBeenCalledTimes(4);
  });

  it('reuses the cached tmdb-imdb mapping and rating snapshot on later requests', async () => {
    const datasetBuffer = buildDataset([
      'tt0133093\t8.7\t2100000',
      'tt0903747\t9.5\t2300000',
    ]);

    global.fetch.mockImplementation((input) => {
      const url = toUrlString(input);

      if (url.includes('/search/multi?query=matrix&api_key=tmdb-test-key')) {
        return jsonResponse({
          page: 1,
          total_pages: 1,
          results: [
            {
              id: 603,
              media_type: 'movie',
              title: 'The Matrix',
              vote_average: 8.2,
              vote_count: 21000,
            },
            {
              id: 1396,
              media_type: 'tv',
              name: 'Breaking Bad',
              first_air_date: '2008-01-20',
              vote_average: 8.5,
              vote_count: 13000,
            },
          ],
        });
      }

      if (url.includes('/movie/603/external_ids?api_key=tmdb-test-key')) {
        return jsonResponse({ imdb_id: 'tt0133093' });
      }

      if (url.includes('/tv/1396/external_ids?api_key=tmdb-test-key')) {
        return jsonResponse({ imdb_id: 'tt0903747' });
      }

      if (url === process.env.IMDB_RATINGS_DATASET_URL) {
        return binaryResponse(datasetBuffer);
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    });

    await fetchMovies('/search/multi?query=matrix');

    global.fetch.mockClear();
    global.fetch.mockImplementation((input) => {
      const url = toUrlString(input);

      if (url.includes('/search/multi?query=matrix&api_key=tmdb-test-key')) {
        return jsonResponse({
          page: 1,
          total_pages: 1,
          results: [
            {
              id: 603,
              media_type: 'movie',
              title: 'The Matrix',
              vote_average: 8.2,
              vote_count: 21000,
            },
            {
              id: 1396,
              media_type: 'tv',
              name: 'Breaking Bad',
              first_air_date: '2008-01-20',
              vote_average: 8.5,
              vote_count: 13000,
            },
          ],
        });
      }

      throw new Error(`Unexpected fetch URL during cached read: ${url}`);
    });

    const result = await fetchMovies('/search/multi?query=matrix');

    expect(result.results[0]).toMatchObject({
      imdb_id: 'tt0133093',
      imdb_rating: 8.7,
      imdb_vote_count: 2100000,
      vote_average: 8.2,
      vote_count: 21000,
    });
    expect(result.results[1]).toMatchObject({
      imdb_id: 'tt0903747',
      imdb_rating: 9.5,
      imdb_vote_count: 2300000,
      vote_average: 8.5,
      vote_count: 13000,
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('refreshes stored mappings and ratings during the daily sync job', async () => {
    const datasetBuffer = buildDataset(['tt0903747\t9.5\t2300000']);

    await MediaExternalMapping.create({
      tmdbId: 1396,
      mediaType: 'tv',
      imdbId: null,
      imdbRating: null,
      imdbVoteCount: null,
    });

    global.fetch.mockImplementation((input) => {
      const url = toUrlString(input);

      if (url.includes('/tv/1396/external_ids?api_key=tmdb-test-key')) {
        return jsonResponse({ imdb_id: 'tt0903747' });
      }

      if (url === process.env.IMDB_RATINGS_DATASET_URL) {
        return binaryResponse(datasetBuffer);
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    });

    const summary = await syncMovieMappings();
    const mapping = await MediaExternalMapping.findOne({
      tmdbId: 1396,
      mediaType: 'tv',
    }).lean();

    expect(summary).toEqual({ synced: 1, rated: 1 });
    expect(mapping).toMatchObject({
      tmdbId: 1396,
      mediaType: 'tv',
      imdbId: 'tt0903747',
      imdbRating: 9.5,
      imdbVoteCount: 2300000,
    });
  });
});

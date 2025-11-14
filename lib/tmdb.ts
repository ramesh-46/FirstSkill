import axios from 'axios';
import { Movie } from '../types';

const API_BASE = 'https://api.themoviedb.org/3';

const getApiKey = (): string => {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error('TMDB_API_KEY is not set in environment variables');
  return key;
};

// Small helper to perform GET requests with timeout and simple retry to mitigate transient network errors
const requestGet = async (url: string, opts: { params?: any } = {}, retries = 2) => {
  const timeout = 8000; // 8s
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await axios.get(url, { timeout, ...opts });
      return res;
    } catch (err) {
      // last attempt -> rethrow
      if (attempt === retries) throw err;
      // small backoff
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  // should not reach here
  throw new Error('unreachable');
};

export const imageUrl = (path: string | null, size = 'w500') => {
  if (!path) return '/no-poster.png';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const fetchPopular = async (): Promise<Movie[]> => {
  try {
    const key = getApiKey();
    const res = await requestGet(`${API_BASE}/movie/popular`, {
      params: { api_key: key, language: 'en-US', page: 1 },
    });
    return res.data.results || [];
  } catch (err) {
    // log and return empty array so server rendering doesn't crash
    // eslint-disable-next-line no-console
    console.error('fetchPopular error', err);
    return [];
  }
};

export const fetchTopRated = async (): Promise<Movie[]> => {
  try {
    const key = getApiKey();
    const res = await requestGet(`${API_BASE}/movie/top_rated`, {
      params: { api_key: key, language: 'en-US', page: 1 },
    });
    return res.data.results || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('fetchTopRated error', err);
    return [];
  }
};

export const fetchUpcoming = async (): Promise<Movie[]> => {
  try {
    const key = getApiKey();
    const res = await requestGet(`${API_BASE}/movie/upcoming`, {
      params: { api_key: key, language: 'en-US', page: 1 },
    });
    return res.data.results || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('fetchUpcoming error', err);
    return [];
  }
};

export const fetchMovieById = async (id: string): Promise<any> => {
  try {
    const key = getApiKey();
    const res = await requestGet(`${API_BASE}/movie/${id}`, {
      params: { api_key: key, language: 'en-US' },
    });
    return res.data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`fetchMovieById error for id=${id}`, err);
    return null;
  }
};

export const fetchMovieVideos = async (id: string): Promise<any[]> => {
  try {
    const key = getApiKey();
    const res = await requestGet(`${API_BASE}/movie/${id}/videos`, {
      params: { api_key: key, language: 'en-US' },
    });
    return res.data.results || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`fetchMovieVideos error for id=${id}`, err);
    return [];
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const key = getApiKey();
    const res = await requestGet(`${API_BASE}/search/movie`, {
      params: { api_key: key, language: 'en-US', query, page: 1, include_adult: false },
    });
    return res.data.results || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`searchMovies error for query=${query}`, err);
    return [];
  }
};

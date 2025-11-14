import React from 'react';
import MovieRow from '../../components/MovieRow';
import { searchMovies } from '../../lib/tmdb';
import { Movie } from '../../types';

interface Props {
  searchParams: Promise<{ query?: string | string[] }>;
}

export default async function SearchPage({ searchParams }: Props) {

  // Next.js 15 — searchParams is a Promise → unwrap it
  const sp = await searchParams;

  // Safely get the query
  let query = '';
  const raw = sp?.query;

  if (typeof raw === 'string') query = raw.trim();
  else if (Array.isArray(raw)) query = raw.join(' ').trim();

  if (!query) {
    return (
      <div style={{ padding: '40px 0' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Search</h2>
        <p style={{ color: 'rgba(0,0,0,0.7)' }}>
          Use the search box in the header to find movies.
        </p>
      </div>
    );
  }

  // Actual API call
  let results: Movie[] = [];
  try {
    results = await searchMovies(query);
  } catch (err) {
    console.error('Search error', err);
    results = [];
  }

  return (
    <div style={{ padding: '12px 0', color: '#071025' }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
        Results for "{query}"
      </h2>

      {results.length === 0 ? (
        <p style={{ color: 'rgba(7,16,37,0.7)' }}>No results found.</p>
      ) : (
        <MovieRow
          movies={results}
          categoryTitle={`Search results (${results.length})`}
        />
      )}
    </div>
  );
}

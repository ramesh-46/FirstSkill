import React from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { fetchPopular, fetchTopRated, fetchUpcoming } from '../lib/tmdb';
import { Movie } from '../types';

export default async function HomePage() {
  // Server-side fetches with resilience: use Promise.allSettled so one failing API won't crash the page
  const results = await Promise.allSettled([
    fetchPopular(),
    fetchTopRated(),
    fetchUpcoming(),
  ]);

  const popular = results[0].status === 'fulfilled' ? (results[0].value as Movie[]) : [];
  const topRated = results[1].status === 'fulfilled' ? (results[1].value as Movie[]) : [];
  const upcoming = results[2].status === 'fulfilled' ? (results[2].value as Movie[]) : [];

  const heroMovie: Movie | null = popular?.[0] ?? null;

  // Filter or limit lists (take first 18 each for richer lists)
  const popularSlice = popular?.slice(0, 18) ?? [];
  const topRatedSlice = topRated?.slice(0, 18) ?? [];
  const upcomingSlice = upcoming?.slice(0, 18) ?? [];

  const allEmpty = popularSlice.length === 0 && topRatedSlice.length === 0 && upcomingSlice.length === 0;

  return (
    <div>
      {heroMovie && <Hero movie={heroMovie} />}

      {allEmpty ? (
        <div style={{ padding: 28, textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Unable to load movies</h2>
          <p style={{ marginBottom: 12 }}>There was a problem fetching movie data. Check your network or TMDB_API_KEY in .env.local and reload the page.</p>
          <button onClick={() => location.reload()} style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--accent)', color: '#000', border: 'none', cursor: 'pointer' }}>Retry</button>
        </div>
      ) : (
        <div>
          <MovieRow movies={popularSlice} categoryTitle="Popular Now" />
          <MovieRow movies={topRatedSlice} categoryTitle="Top Rated" />
          <MovieRow movies={upcomingSlice} categoryTitle="Upcoming" />
        </div>
      )}
    </div>
  );
}

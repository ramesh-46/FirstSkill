import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchMovieById, imageUrl } from '../../../lib/tmdb';
import TrailerModal from '../../../components/TrailerModal';

// Next.js 15: params is a Promise → must unwrap
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: PageProps) {
  try {
    const { id } = await params; // ✅ FIX — unwrap params

    const movie = await fetchMovieById(id);

    if (!movie) {
      return <div style={{ padding: 28 }}>Movie not found</div>;
    }

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 20,
          padding: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 20,
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
        {/* Poster */}
        <div style={{ flex: '0 0 320px', minWidth: 220 }}>
          <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}>
            <Image
              src={
                imageUrl(
                  movie.poster_path || movie.backdrop_path,
                  'w780'
                ) || '/placeholder.png'
              }
              alt={movie.title}
              width={360}
              height={540}
              style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
            />
          </div>
        </div>

        {/* Movie Content */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
            {movie.title}
          </h1>

          <p
            style={{
              color: 'rgba(255,255,255,0.72)',
              marginBottom: 12,
            }}
          >
            {movie.tagline ? `"${movie.tagline}"` : null}
          </p>

          {/* Tags and extra metadata */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
              Release: {movie.release_date ?? 'N/A'}
            </span>

            <span style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
              Rating: {movie.vote_average ?? 'N/A'}
            </span>

            {movie.runtime ? (
              <span style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
                Runtime: {movie.runtime} min
              </span>
            ) : null}

            {movie.genres && movie.genres.length > 0 ? (
              <span style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
                Genres: {movie.genres.map((g: any) => g.name).join(', ')}
              </span>
            ) : null}
          </div>

          {/* Overview */}
          <h3 style={{ marginTop: 6, marginBottom: 8 }}>Overview</h3>
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.6,
            }}
          >
            {movie.overview}
          </p>

          {/* Buttons */}
          <div style={{ marginTop: 18, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/">
              <button className="back-btn">← Back</button>
            </Link>

            {/* Trailer modal is a client component that will fetch videos from our API route */}
            <TrailerModal movieId={movie.id} movieTitle={movie.title} />

            {movie.homepage ? (
              <a href={movie.homepage} target="_blank" rel="noreferrer" style={{ marginLeft: 8, color: 'var(--accent)', textDecoration: 'underline' }}>
                Official site
              </a>
            ) : null}
          </div>
        </div>
        </div>
      </div>
    );
  } catch (err) {
    // If anything unexpected happens during server render, return a safe fallback UI.
    // eslint-disable-next-line no-console
    console.error('MovieDetailPage render error', err);
    return (
      <div style={{ padding: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>Something went wrong</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Unable to render movie details right now. Try reloading the page.</p>
      </div>
    );
  }
}

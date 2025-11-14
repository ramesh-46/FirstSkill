import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Movie } from '../types';
import { imageUrl } from '../lib/tmdb';

export default function Hero({ movie }: { movie: Movie }) {
  if (!movie) return null;

  const backdrop = movie.backdrop_path ?? movie.poster_path;
  return (
    <section className="hero fade-in">
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src={imageUrl(backdrop, 'w1280')}
          alt={movie.title}
          fill
          style={{ objectFit: 'cover', filter: 'brightness(0.55) contrast(1.05)' }}
          priority
        />
      </div>

      <div className="hero-content">
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>{movie.title}</h1>
        <p style={{ marginBottom: 16, color: 'rgba(255,255,255,0.95)', fontSize: 15, lineHeight: 1.4 }}>
          {movie.overview?.slice(0, 220)}{movie.overview && movie.overview.length > 220 ? '...' : ''}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href={`/movie/${movie.id}`}>
            <button style={{
              padding: '10px 16px',
              borderRadius: 10,
              background: '#06b6d4',
              border: 'none',
              fontWeight: 700,
            }}>
              View Details
            </button>
          </Link>
          <button style={{
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.12)',
            border: 'none',
            color: 'white',
          }}>
            + My List
          </button>
        </div>
      </div>
    </section>
  );
}

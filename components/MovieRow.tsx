'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '../types';
import { imageUrl } from '../lib/tmdb';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function MovieRow({ movies, categoryTitle }: { movies: Movie[]; categoryTitle: string; }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // drag-to-scroll
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const onMouseDown = (e: React.MouseEvent) => {
    isDown = true;
    startX = e.pageX - (scrollerRef.current?.offsetLeft || 0);
    scrollLeft = scrollerRef.current?.scrollLeft || 0;
    (scrollerRef.current as any).classList.add('drag-active');
  };
  const onMouseLeave = () => { isDown = false; (scrollerRef.current as any)?.classList.remove('drag-active'); };
  const onMouseUp = () => { isDown = false; (scrollerRef.current as any)?.classList.remove('drag-active'); };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="movie-row" style={{ marginBottom: 22 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{categoryTitle}</h3>
      <div
        ref={scrollerRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 6,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {movies.map((m) => (
          <Link key={m.id} href={`/movie/${m.id}`}>
            <motion.div whileHover={{ scale: 1.06 }} className="movie-card" style={{ flexShrink: 0 }}>
              <Image
                src={imageUrl(m.poster_path, 'w500')}
                alt={m.title}
                width={160}
                height={240}
                style={{ objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: 8, position: 'relative' }}>
                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{m.title}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{m.release_date ?? ''}</p>
                <div className="movie-overlay" style={{ display: 'none' }}>
                  <p style={{ fontSize: 13, fontWeight: 700 }}>{m.title}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{m.overview?.slice(0, 120)}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>⭐ {m.vote_average ?? 'N/A'}</p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .movie-card:hover .movie-overlay { display: block; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.75)); padding: 12px; }
      `}</style>
    </section>
  );
}

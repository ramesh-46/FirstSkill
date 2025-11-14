'use client';

import React, { useState } from 'react';

export default function TrailerModal({ movieId, movieTitle }: { movieId: number | string; movieTitle?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [source, setSource] = useState<'tmdb' | 'youtube-search' | null>(null);

  const openTrailer = async () => {
    setOpen(true);
    if (videoKey) return; // already loaded
    setLoading(true);
    try {
      const res = await fetch(`/api/movie/${movieId}/videos`);
      if (!res.ok) {
        console.error('Trailer API returned non-OK', res.status);
        setVideoKey(null);
        return;
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        console.error('Trailer API returned non-JSON response', contentType);
        setVideoKey(null);
        return;
      }
      let json: any = null;
      try {
        json = await res.json();
      } catch (err) {
        console.error('Failed to parse JSON from trailer API', err);
        setVideoKey(null);
        return;
      }
      const vids = json.results || [];
      // prefer official trailer, YouTube site
      const yt = vids.find((v: any) => v.site === 'YouTube' && /trailer/i.test(v.type)) || vids.find((v: any) => v.site === 'YouTube');
      if (yt?.key) {
        setVideoKey(yt.key);
        setSource('tmdb');
      } else {
        setVideoKey(null);
        setSource(null);
      }
    } catch (err) {
      console.error('Failed to load videos', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={openTrailer}
        className="play-trailer-btn"
        style={{
          padding: '10px 14px',
          borderRadius: 10,
          background: '#06b6d4',
          color: '#000',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Play Trailer
      </button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'relative', width: 'min(1000px, 95%)', background: '#071025', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 8 }}>
              <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: 12 }}>
              {loading ? (
                <p style={{ color: 'white' }}>Loading trailer…</p>
                ) : videoKey ? (
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
                    title="Trailer"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                ) : (
                // fallback: embed a YouTube search-as-playlist for "<movieTitle> trailer" so the first result plays
                movieTitle ? (
                  <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <iframe
                      src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(movieTitle + ' trailer')}&rel=0&autoplay=1`}
                      title={`Search results for ${movieTitle} trailer`}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <p style={{ color: 'white' }}>Trailer not available.</p>
                )
              )}
            </div>
            {/* small source label */}
            <div style={{ padding: '8px 12px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              {source === 'tmdb' && <span>Source: TMDB</span>}
              {source === 'youtube-search' && <span>Source: YouTube (search fallback)</span>}
              {!source && <span style={{ opacity: 0.85 }}>Source: YouTube (search fallback)</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

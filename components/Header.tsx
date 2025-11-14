'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [query, setQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?query=${encodeURIComponent(q)}`);
  };

  return (
    <header className="site-header header-white">
      <div className="container header-inner">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/" aria-label="StreamX Home">
            <Image src="/logo.svg" alt="StreamX" width={140} height={44} priority />
          </Link>
          <nav className="nav-links" aria-label="Main navigation" style={{ gap: 12, alignItems: 'center' }}>
            <Link href="/" className="nav-btn">Home</Link>
            <Link href="/" className="nav-btn">Movies</Link>
            <Link href="/" className="nav-btn">TV</Link>
            <Link href="/" className="nav-btn">My List</Link>
          </nav>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <form onSubmit={onSubmit} className="search-wrapper" role="search">
            <label htmlFor="site-search" className="sr-only">Search movies</label>
            <div style={{ position: 'relative' }}>
              <input
                id="site-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies"
                className="search-input search-input-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSubmit(e as unknown as React.FormEvent);
                }}
                aria-label="Search movies"
              />
              <button type="submit" aria-label="Search" className="search-btn" style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M21 21l-4.35-4.35" stroke="#071025" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11" cy="11" r="6" stroke="#071025" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </form>

          <button className="sign-in-btn" style={{ padding: '8px 12px', borderRadius: 10, background: '#f3f4f6', border: '1px solid rgba(7,16,37,0.06)', color: '#071025' }}>Sign in</button>
          <button 
            className="menu-btn" 
            aria-label="menu" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'transparent', border: 'none', color: '#071025', padding: 8, cursor: 'pointer' }}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          <Link href="/" className="mobile-nav-btn">Home</Link>
          <Link href="/" className="mobile-nav-btn">Movies</Link>
          <Link href="/" className="mobile-nav-btn">TV</Link>
          <Link href="/" className="mobile-nav-btn">My List</Link>
        </nav>
      )}
    </header>
  );
}

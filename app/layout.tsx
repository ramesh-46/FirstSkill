import './globals.css';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';

export const metadata = {
  title: 'Streaming Dashboard - StreamX',
  description: 'A simplified streaming dashboard built with Next.js 14 and TypeScript',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="site-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main style={{ flex: 1, padding: '28px 0', width: '100%' }}>
            <div className="container">{children}</div>
          </main>
          <footer className="site-footer">
            <div className="container footer-inner">
              <div className="footer-col brand">
                <Link href="/" aria-label="StreamX Home">
                  <Image src="/logo.svg" alt="StreamX" width={120} height={36} />
                </Link>
                <p className="muted">StreamX — discover and stream movies and TV shows. Curated lists and trailers.</p>
              </div>

              <div className="footer-col">
                <h4>Explore</h4>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/movies">Movies</Link></li>
                  <li><Link href="/tv">TV</Link></li>
                  <li><Link href="/my-list">My List</Link></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Support</h4>
                <ul>
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">Contact Us</a></li>
                  <li><a href="#">Privacy</a></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Follow</h4>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="#" aria-label="Twitter" className="social-pill">Twitter</a>
                  <a href="#" aria-label="Instagram" className="social-pill">Instagram</a>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>© StreamX {new Date().getFullYear()}</div>
                <div className="muted">Built with care • Terms · Privacy</div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

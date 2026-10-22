import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/useAuth';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-white/10 shadow-2xl'
          : 'bg-transparent'
      }`}
      data-purpose="primary-navigation"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group" data-purpose="site-brand">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white transition-transform duration-500 group-hover:rotate-[30deg]"
              fill="none" stroke="currentColor" viewBox="0 0 40 40"
            >
              <circle cx="20" cy="20" r="18" strokeDasharray="2 3" strokeOpacity="0.35" strokeWidth="1.2" />
              <circle cx="20" cy="20" r="13" strokeOpacity="0.7" strokeWidth="1.5" />
              <circle cx="20" cy="20" r="8" strokeWidth="2" />
              <circle cx="20" cy="20" fill="white" r="3" />
              <path d="M7 20H1M39 20H33M20 7V1M20 39V33" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
              RetinaGuard
              <span className="font-mono text-[10px] px-1.5 py-0.5 font-bold tracking-wide" style={{background:'var(--c-teal)', color:'#000'}}>
                AI
              </span>
            </div>
            <span className="block text-[9px] tracking-[0.2em] uppercase text-white/50 font-mono">
              Explainable Retinal Screening
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <nav className="flex items-center gap-8 text-sm font-medium" data-purpose="nav-links">
            {[
              { label: 'Overview',          path: '/' },
              { label: 'Project PPT',       path: '/presentation' },
              { label: 'Dataset Training',  path: '/train' },
              { label: 'How It Works',      path: '/how-it-works' },
              { label: 'Explainability',    path: '/screening/RG-2025-0891/explanation' },
              { label: 'Performance',       path: '/model-performance' },
            ].map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`transition-colors duration-200 ${
                  isActive(path)
                    ? 'text-white font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="text-white/60 hover:text-white transition-colors"
              >
                {user?.name.split(' ')[0]}
              </Link>
            )}
          </nav>

          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="btn-primary text-[11px] py-3 px-7"
          >
            {isAuthenticated ? 'Dashboard →' : 'Sign In'}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-white/10 px-6 py-8 space-y-6">
          {[
            { label: 'Overview',          path: '/' },
            { label: 'Project PPT',       path: '/presentation' },
            { label: 'Dataset Training',  path: '/train' },
            { label: 'How It Works',      path: '/how-it-works' },
            { label: 'Explainability',    path: '/screening/RG-2025-0891/explanation' },
            { label: 'Performance',       path: '/model-performance' },
            { label: 'Login',             path: '/login' },
          ].map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-white/70 hover:text-white font-medium transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/screening/new"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center btn-primary py-3"
          >
            Start Screening
          </Link>
        </div>
      )}
    </header>
  );
};

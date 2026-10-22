import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/useAuth';

const navGroups = [
  {
    items: [
      { label: 'Dashboard',      path: '/dashboard' },
      { label: 'New Screening',  path: '/screening/new' },
      { label: 'History',        path: '/history' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { label: 'Model Performance', path: '/model-performance' },
      { label: 'Reports',           path: '/reports' },
      { label: 'How It Works',      path: '/how-it-works' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Simulation', path: '/admin/simulation' },
      { label: 'Settings',   path: '/settings' },
    ],
  },
];

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) =>
    path === '/dashboard'
      ? location.pathname === path
      : location.pathname.startsWith(path);

  const handleSignOut = () => { logout(); navigate('/'); };

  /* Current page label for top-bar breadcrumb */
  const currentLabel = navGroups
    .flatMap(g => g.items)
    .find(item => isActive(item.path))?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex font-sans">

      {/* ── Sidebar ──────────────────────────────── */}
      <aside className="hidden lg:flex w-[220px] flex-col bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-40">

        {/* Brand */}
        <div className="px-6 pt-8 pb-6">
          <Link to="/" className="block">
            <span className="text-lg font-bold text-black tracking-tight">RetinaGuard AI</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navGroups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'pt-5' : ''}>
              {group.label && (
                <div className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {group.label}
                </div>
              )}
              {group.items.map(item => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block w-full text-left px-3 py-2.5 text-sm rounded-lg font-medium transition-all duration-150 ${
                      active
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User + signout */}
        <div className="px-4 py-5 border-t border-gray-100">
          <div className="text-sm font-medium text-black truncate">{user?.name || 'Dr. Sen'}</div>
          <div className="text-xs text-gray-400 truncate mb-3">{user?.healthCenter || 'PHC Malur'}</div>
          <button
            onClick={handleSignOut}
            className="text-xs text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────── */}
      <div className="lg:pl-[220px] flex-1 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="h-[60px] bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 rounded text-gray-500 hover:bg-gray-100"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <h1 className="text-base font-semibold text-black">{currentLabel}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Demo badge */}
            <span className="hidden sm:inline text-[10px] font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              Demo Sandbox
            </span>
            {/* User avatar initial */}
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold select-none">
              {(user?.name || 'D')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Mobile sidebar */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
            <div className="relative w-[220px] bg-white h-full z-10 flex flex-col p-6 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-black">RetinaGuard AI</span>
                <button onClick={() => setMobileOpen(false)} className="text-gray-400">✕</button>
              </div>
              <nav className="space-y-1 flex-1">
                {navGroups.flatMap(g => g.items).map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 text-sm rounded-lg font-medium ${
                      isActive(item.path) ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <button onClick={handleSignOut} className="mt-6 text-sm text-gray-400 hover:text-black transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

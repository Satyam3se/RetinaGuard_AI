import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-black selection:text-white">
      <Header />
      {/* NO pt-20 — hero sections handle their own top padding so header overlays them */}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

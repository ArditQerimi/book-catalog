
'use client';

import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import GeometricOverlay from './GeometricOverlay';
import { X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { logoutAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface LayoutClientProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const LayoutClient: React.FC<LayoutClientProps> = ({ children, isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    setIsMenuOpen(false);
    router.refresh();
  };

  return (
    <div className="min-h-screen relative islamic-pattern text-gray-800 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <GeometricOverlay />

      <Navbar 
        isAuthenticated={isAuthenticated}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-emerald-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="flex flex-col h-full p-8">
            <div className="flex justify-end mb-12">
              <button onClick={() => setIsMenuOpen(false)} className="p-3 text-white bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex flex-col gap-8">
              {['Archive', 'Scholars', 'History'].map(label => (
                <Link key={label} href={label.toLowerCase() === 'archive' ? '/' : `/${label.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-white italic text-left">{label}</Link>
              ))}
              <div className="h-px bg-white/10 w-full" />
              {isAuthenticated ? (
                <>
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-amber-400 italic text-left">Admin Panel</Link>
                  <button onClick={handleLogout} className="text-2xl font-bold text-red-400 italic text-left flex items-center gap-2"><LogOut className="w-6 h-6" /> Sign Out</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-white italic text-left">Scribe Portal</Link>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 relative z-10 min-h-[60vh]">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default LayoutClient;

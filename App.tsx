
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { X, Database, LogOut } from 'lucide-react';
import { Book, ActivePage } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GeometricOverlay from './components/GeometricOverlay';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import { getBooksAction, logoutAction } from './lib/actions';
import { middleware } from './middleware';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const path = location.pathname.substring(1) || 'archive';
      const result = middleware(path as ActivePage);
      const isNowAuthenticated = !!document.cookie.includes('nur_session=authenticated_scribe');
      setIsAuthenticated(isNowAuthenticated);
      if (!result.authorized && result.redirect) navigate(`/${result.redirect}`);
    };
    checkAuth();
  }, [location.pathname, navigate]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const data = await getBooksAction();
      setBooks(data);
    } catch (error) {
      console.error("DB Sync Failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAction();
    setIsAuthenticated(false);
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative islamic-pattern text-gray-800 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <GeometricOverlay />

      <Navbar 
        currentPath={location.pathname}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
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
                <Link key={label} to={label.toLowerCase() === 'archive' ? '/' : `/${label.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-white italic text-left">{label}</Link>
              ))}
              <div className="h-px bg-white/10 w-full" />
              {isAuthenticated ? (
                <>
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-amber-400 italic text-left">Admin Panel</Link>
                  <button onClick={handleLogout} className="text-2xl font-bold text-red-400 italic text-left flex items-center gap-2"><LogOut className="w-6 h-6" /> Sign Out</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-white italic text-left">Scribe Portal</Link>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 relative z-10 min-h-[60vh]">
        <Routes>
          <Route path="/" element={
            isLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-12 h-12 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-emerald-900/40 font-bold italic text-sm tracking-widest uppercase">Consulting the Scribes...</p>
              </div>
            ) : <HomePage books={books} />
          } />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route path="/login" element={<LoginPage onSuccess={() => navigate('/admin')} />} />
          <Route path="/admin" element={
            isAuthenticated ? <AdminPage books={books} onRefresh={fetchInitialData} /> : (
              <div className="py-40 text-center animate-in fade-in duration-700">
                 <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><Database className="w-10 h-10 text-emerald-800 animate-pulse" /></div>
                 <h3 className="text-4xl font-bold text-emerald-900 italic mb-4 uppercase tracking-tighter opacity-10">Restricted Area</h3>
                 <p className="text-emerald-800/40 font-bold tracking-widest text-xs uppercase italic">Verifying credentials via Nur Middleware...</p>
              </div>
            )
          } />
          {['scholars', 'history'].map(path => (
            <Route key={path} path={`/${path}`} element={
              <div className="py-40 text-center animate-in fade-in duration-700">
                 <h3 className="text-4xl font-bold text-emerald-900 italic mb-4 uppercase tracking-tighter opacity-10 uppercase">{path} Locked</h3>
                 <p className="text-emerald-800/40 font-bold tracking-widest text-xs">AWAITING MANUSCRIPT UNLOCK</p>
              </div>
            } />
          ))}
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;

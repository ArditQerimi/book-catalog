
'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Scroll, BookOpen, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        navigate('/admin');
      } else {
        const data = await response.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a1f1c]">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-20"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500 rounded-full blur-[128px] opacity-20"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500 rounded-full blur-[128px] opacity-10"></div>
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center border-b border-white/5 bg-white/5">
            <div className="w-16 h-16 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <KeyRound className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1 font-serif tracking-wide">Scribe Access</h2>
            <p className="text-emerald-200/60 text-sm italic">Enter credentials to access the archive</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-medium text-emerald-200/50 uppercase tracking-wider mb-1.5 ml-1">Scribe ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Scroll className="h-4 w-4 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-black/20 border border-white/10 rounded-lg text-emerald-100 placeholder-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your identifier"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-medium text-emerald-200/50 uppercase tracking-wider mb-1.5 ml-1">Passphrase</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="h-4 w-4 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-black/20 border border-white/10 rounded-lg text-emerald-100 placeholder-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a1f1c] focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? 'Verifying...' : 'Unlock Archive'}
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 py-4 bg-black/20 border-t border-white/5 text-center">
            <p className="text-xs text-emerald-500/40">
              Restricted access for authorized scribes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

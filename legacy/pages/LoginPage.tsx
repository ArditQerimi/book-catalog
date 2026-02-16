
import React, { useState } from 'react';
import { ShieldCheck, User, Key, ArrowRight, AlertCircle } from 'lucide-react';
import { loginAction } from '../lib/actions';

interface LoginPageProps {
  onSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || "Authentication failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 md:mt-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-[40px] shadow-2xl border border-emerald-100 overflow-hidden relative">
        <div className="bg-emerald-900 h-32 flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-10 islamic-pattern" />
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        <div className="p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-emerald-950 italic mb-2">Scribe’s Gate</h2>
          <p className="text-emerald-800/40 text-xs font-bold uppercase tracking-widest mb-8">Management Portal Authentication</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200 group-focus-within:text-emerald-500 transition-colors" />
                <input name="username" type="text" placeholder="admin" className="w-full bg-emerald-50/30 border border-emerald-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-emerald-950" required />
              </div>
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest ml-1">Secret Key</label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200 group-focus-within:text-emerald-500 transition-colors" />
                <input name="password" type="password" placeholder="admin" className="w-full bg-emerald-50/30 border border-emerald-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-emerald-950" required />
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-bold animate-in shake duration-300">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <button type="submit" disabled={isLoading} className="w-full bg-emerald-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-900 transition-all shadow-xl active:scale-95 mt-2 disabled:opacity-50">
              {isLoading ? "AUTHENTICATING..." : "AUTHENTICATE"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-10 pt-6 border-t border-emerald-50">
             <p className="text-[9px] text-emerald-800/30 font-bold uppercase tracking-widest leading-loose">
               Notice: Unauthorized access to the digital ledger is strictly prohibited and logged.
             </p>
          </div>
        </div>
      </div>
      <p className="text-center mt-8 text-emerald-800/40 text-xs italic">"Verily, knowledge is a treasury whose keys are the questions."</p>
    </div>
  );
};

export default LoginPage;

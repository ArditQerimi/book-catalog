
import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import IconWrapper from './IconWrapper';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isSearching: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onSearch, isSearching }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
        <span className="text-[9px] font-bold text-emerald-900/40 uppercase tracking-widest">Discovery Mode</span>
      </div>
      <form onSubmit={onSearch} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <input 
           type="text" 
           value={value}
           onChange={(e) => onChange(e.target.value)}
           placeholder="Search archive or ask the Scribe..."
           className="relative w-full bg-white border border-emerald-100 rounded-xl py-3 pl-3 pr-10 text-[10px] focus:ring-2 focus:ring-emerald-200 outline-none transition-all shadow-sm"
        />
        <button type="submit" disabled={isSearching} className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-800 hover:text-amber-600 transition-colors">
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <IconWrapper icon={Search} size={14} />
          )}
        </button>
      </form>
      <p className="text-[8px] text-emerald-800/30 italic">Ask about specific scholars, eras, or philosophical concepts.</p>
    </div>
  );
};

export default SearchInput;

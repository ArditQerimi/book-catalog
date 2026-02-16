
import * as React from 'react';
import { Search } from 'lucide-react';

interface ArchiveHeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isSearching: boolean;
}

const ArchiveHeader: React.FC<ArchiveHeaderProps> = ({ searchQuery, setSearchQuery, onSearch, isSearching }: ArchiveHeaderProps) => {
  return (
    <header className="mb-16 md:mb-20 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
      <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-emerald-950 mb-8 md:mb-10 leading-tight italic max-w-5xl mx-auto">
        Seek the <span className="text-amber-600">Hidden</span> <br /> Gems of History.
      </h2>

      <div className="max-w-2xl mx-auto relative group px-4">
        <form onSubmit={onSearch} className="relative flex items-center">
          <div className="absolute left-7 text-emerald-300">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter keywords..."
            className="w-full bg-white border border-emerald-50 rounded-full py-5 pl-16 pr-32 text-sm md:text-base focus:ring-4 focus:ring-emerald-100/50 outline-none transition-all shadow-xl shadow-emerald-900/5 placeholder:text-gray-500"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 bg-emerald-800 text-white px-8 py-3.5 rounded-full font-bold text-xs md:text-sm tracking-widest hover:bg-emerald-900 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "DISCOVER"}
          </button>
        </form>
      </div>

      <p className="mt-10 text-emerald-700/40 max-w-xl mx-auto text-sm md:text-base italic serif">
        Traversing the infinite landscape of Islamic thought and literature.
      </p>
    </header>
  );
};

export default ArchiveHeader;

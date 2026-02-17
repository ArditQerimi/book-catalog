
"use client";

import * as React from 'react';
import { Search } from 'lucide-react';
import { FilterState } from '@/types';

interface ArchiveSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

const ArchiveSidebar: React.FC<ArchiveSidebarProps> = ({
  filters, setFilters, searchQuery, setSearchQuery
}) => {
  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="sticky top-28 space-y-6">
        <div className="bg-white/60 p-8 rounded-[32px] border border-emerald-50/50 shadow-lg backdrop-blur-xl">
          <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-900 mb-8 border-b border-emerald-100 pb-4">
            <Search className="w-3 h-3" />
            Refine Archive
          </h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest pl-1">Manuscript Title</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="The Canon..."
                className="w-full bg-emerald-50/30 border border-emerald-100/50 rounded-xl py-3 px-4 text-sm font-medium text-emerald-900 placeholder:text-emerald-800/20 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest pl-1">Author Name</label>
              <input
                type="text"
                value={filters.author || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Ibn Sina..."
                className="w-full bg-emerald-50/30 border border-emerald-100/50 rounded-xl py-3 px-4 text-sm font-medium text-emerald-900 placeholder:text-emerald-800/20 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest pl-1">Max Pages: <span className="text-emerald-600">{filters.maxPages || 1000}</span></label>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={filters.maxPages || 1000}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPages: Number(e.target.value) }))}
                className="w-full accent-emerald-600 h-1 bg-emerald-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
                <span>0</span>
                <span>2000+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ArchiveSidebar;


import * as React from 'react';
import { Trash2 } from 'lucide-react';
import { SortOption } from '@/types';
import SortDropdown from './SortDropdown';

interface ArchiveToolsProps {
  hasFilters: boolean;
  onReset: () => void;
  filteredCount: number;
  totalCount: number;
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
}

const ArchiveTools: React.FC<ArchiveToolsProps> = ({
  hasFilters, onReset, filteredCount, totalCount, sortBy, setSortBy
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-10 min-h-[40px]">
      <div className="flex items-center gap-4">
        {hasFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 rounded-full text-[10px] font-bold hover:bg-red-100 transition-all border border-red-100 shadow-sm"
          >
            <Trash2 className="w-3 h-3" /> CLEAR ALL FILTERS
          </button>
        )}
        <p className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-[0.2em]">
          Showing {filteredCount} of {totalCount} Entries
        </p>
      </div>

      <SortDropdown value={sortBy} onChange={setSortBy} />
    </div>
  );
};

export default ArchiveTools;

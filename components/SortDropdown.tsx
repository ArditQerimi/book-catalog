
import React from 'react';
import { SortOption } from '../types';

interface SortDropdownProps {
  value: SortOption;
  onChange: (val: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2 bg-emerald-50/50 px-3 py-1.5 rounded-xl border border-emerald-100 shadow-sm">
      <span className="text-[9px] font-bold text-emerald-800/40 uppercase tracking-widest">Order by</span>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="bg-transparent border-none text-[10px] font-bold text-emerald-800 outline-none cursor-pointer focus:ring-0"
      >
        <option value="Oldest">Date (Oldest First)</option>
        <option value="Newest">Date (Newest First)</option>
        <option value="Title A-Z">Title (A-Z)</option>
      </select>
    </div>
  );
};

export default SortDropdown;

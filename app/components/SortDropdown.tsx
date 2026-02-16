"use client";

import * as React from 'react';
import { SortOption } from '@/types';

interface SortDropdownProps {
  value: SortOption;
  onChange: (val: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }: SortDropdownProps) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold text-emerald-900/30 uppercase tracking-widest hidden sm:inline">Sort By</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="bg-emerald-50 text-emerald-900 text-[10px] font-bold py-2.5 px-4 rounded-full border-none outline-none ring-1 ring-emerald-100 focus:ring-2 focus:ring-emerald-200 transition-all appearance-none cursor-pointer pr-10"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23064e3b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
      >
        <option value="Oldest">Chronological (Oldest First)</option>
        <option value="Newest">Recent Additions</option>
        <option value="Alphabetical">Categorical (A-Z)</option>
      </select>
    </div>
  );
};

export default SortDropdown;

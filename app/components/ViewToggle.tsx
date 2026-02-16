"use client";

import * as React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { ViewMode } from '@/types';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ mode, onChange }) => {
  return (
    <div className="flex bg-emerald-50/50 p-1 rounded-2xl border border-emerald-100">
      <button
        onClick={() => onChange('grid')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold transition-all ${mode === 'grid'
          ? 'bg-white text-emerald-900 shadow-sm ring-1 ring-emerald-100'
          : 'text-emerald-900/40 hover:text-emerald-900/60'
          }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        GRID VIEW
      </button>
      <button
        onClick={() => onChange('list')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold transition-all ${mode === 'list'
          ? 'bg-white text-emerald-900 shadow-sm ring-1 ring-emerald-100'
          : 'text-emerald-900/40 hover:text-emerald-900/60'
          }`}
      >
        <List className="w-3.5 h-3.5" />
        LIST VIEW
      </button>
    </div>
  );
};

export default ViewToggle;

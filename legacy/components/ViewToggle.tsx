
import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import IconWrapper from './IconWrapper';
import { ViewMode } from '../types';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ mode, onChange }) => {
  return (
    <div>
      <p className="text-[9px] uppercase font-bold text-emerald-600/60 mb-3 tracking-widest">Display Perspective</p>
      <div className="flex p-1 bg-emerald-100/30 rounded-xl gap-1">
        <button 
          onClick={() => onChange('grid')} 
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all ${mode === 'grid' ? 'bg-white shadow-sm text-emerald-900' : 'text-emerald-800/40 hover:text-emerald-800'}`}
        >
          <IconWrapper icon={LayoutGrid} size={14} />
        </button>
        <button 
          onClick={() => onChange('list')} 
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all ${mode === 'list' ? 'bg-white shadow-sm text-emerald-900' : 'text-emerald-800/40 hover:text-emerald-800'}`}
        >
          <IconWrapper icon={List} size={14} />
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;

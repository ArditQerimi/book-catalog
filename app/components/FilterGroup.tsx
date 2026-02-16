"use client";

import * as React from 'react';

interface FilterGroupProps {
  label: string;
  icon?: React.ReactNode;
  options: string[];
  currentValue: string;
  onChange: (val: string) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ label, icon, options, currentValue, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${currentValue === option
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-md shadow-emerald-900/10'
              : 'bg-white/50 text-emerald-900/60 border-emerald-100 hover:border-emerald-300'
              }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;

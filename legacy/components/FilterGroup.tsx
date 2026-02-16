
import React from 'react';

interface FilterGroupProps {
  label: string;
  icon?: React.ReactNode;
  options: string[];
  currentValue: string;
  onChange: (val: string) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ label, icon, options, currentValue, onChange }) => {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-emerald-600/60 mb-3 tracking-widest">
        {icon} {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button 
            key={opt} 
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${currentValue === opt ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white text-emerald-800 border-emerald-50 hover:border-emerald-200'}`}
          >
            {opt === 'All' && label.includes('Era') ? 'All Eras' : opt === 'All' && label.includes('Language') ? 'All Tongues' : opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;

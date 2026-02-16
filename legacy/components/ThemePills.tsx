
import React from 'react';

interface ThemePillsProps {
  themes: string[];
}

const ThemePills: React.FC<ThemePillsProps> = ({ themes }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {themes.map(theme => (
        <span 
          key={theme} 
          className="px-4 py-2 bg-white border border-emerald-100 rounded-2xl text-[11px] font-bold text-emerald-800 shadow-sm hover:border-emerald-300 transition-colors"
        >
          # {theme}
        </span>
      ))}
    </div>
  );
};

export default ThemePills;

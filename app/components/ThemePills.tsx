"use client";

import React from 'react';

interface ThemePillsProps {
  themes: string[];
}

const ThemePills: React.FC<ThemePillsProps> = ({ themes }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {themes.map((theme) => (
        <span
          key={theme}
          className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-2xl text-[10px] font-bold border border-emerald-100 hover:bg-emerald-100 transition-all cursor-default"
        >
          {theme}
        </span>
      ))}
    </div>
  );
};

export default ThemePills;

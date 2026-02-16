"use client";

import * as React from 'react';

interface BookStatsProps {
  year: number;
  pages: number;
  language: string;
  price?: string;
}

const BookStats: React.FC<BookStatsProps> = ({ year, pages, language, price }) => {
  const StatItem = ({ label, value, hasBorder = false }: { label: string, value: string | number, hasBorder?: boolean }) => (
    <div className={`text-center group ${hasBorder ? 'border-x border-emerald-50' : ''}`}>
      <p className="text-[9px] text-emerald-800/30 uppercase font-bold mb-2 tracking-widest group-hover:text-emerald-800 transition-colors">{label}</p>
      <p className="text-2xl font-bold text-emerald-950 italic">{value}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-6 pt-12 border-t border-emerald-50">
      <StatItem label="Era" value={`${year} CE`} />
      <StatItem label="Extent" value={`${pages} Pages`} hasBorder />
      <StatItem label="Medium" value={language.split('/')[0]} hasBorder />
      <StatItem label="Price" value={price ? `£${Number(price).toFixed(2)}` : 'N/A'} />
    </div>
  );
};

export default BookStats;

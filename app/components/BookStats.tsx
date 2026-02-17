"use client";

import * as React from 'react';

interface BookStatsProps {
  year: number;
  pages: number;
  language: string;
  price?: string;
}

const BookStats: React.FC<BookStatsProps> = ({ year, pages, language, price }) => {
  const StatItem = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex flex-col items-start group border-b border-emerald-50 pb-4 last:border-0 last:pb-0">
      <p className="text-[10px] text-emerald-800/40 uppercase font-bold mb-1 tracking-widest group-hover:text-emerald-800 transition-colors">{label}</p>
      <p className="text-xl font-bold text-emerald-950 italic">{value}</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pt-12 border-t border-emerald-50">
      <StatItem label="Era" value={`${year} CE`} />
      <StatItem label="Extent" value={`${pages} Pages`} />
      <StatItem label="Medium" value={language.split('/')[0]} />
      <StatItem label="Price" value={price ? `€${Number(price).toFixed(2)}` : 'N/A'} />
    </div>
  );
};

export default BookStats;

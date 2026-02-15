
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'neutral';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'emerald', className = '' }) => {
  const variants = {
    emerald: 'bg-emerald-100 text-emerald-800',
    amber: 'bg-amber-100 text-amber-800',
    neutral: 'bg-emerald-50 text-emerald-800/40'
  };

  return (
    <span className={`px-4 py-1.5 text-[9px] font-bold rounded-full uppercase tracking-widest shadow-sm ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;

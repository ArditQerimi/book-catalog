
import React from 'react';

const GeometricOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] overflow-hidden">
      <svg className="absolute -top-20 -left-20 w-[400px] h-[400px]" viewBox="0 0 100 100">
        <path d="M50 0 L61.23 38.77 L100 50 L61.23 61.23 L50 100 L38.77 61.23 L0 50 L38.77 38.77 Z" fill="currentColor" className="text-emerald-900" />
      </svg>
      <svg className="absolute -bottom-20 -right-20 w-[600px] h-[600px]" viewBox="0 0 100 100">
        <path d="M50 0 L61.23 38.77 L100 50 L61.23 61.23 L50 100 L38.77 61.23 L0 50 L38.77 38.77 Z" fill="currentColor" className="text-emerald-900" />
      </svg>
    </div>
  );
};

export default GeometricOverlay;


import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-xl bg-white border border-emerald-100 text-emerald-800 disabled:opacity-30 transition-all hover:bg-emerald-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-1.5">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${currentPage === page ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/20' : 'bg-white text-emerald-800 border border-emerald-50 hover:border-emerald-200'}`}
          >
            {page}
          </button>
        ))}
      </div>

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl bg-white border border-emerald-100 text-emerald-800 disabled:opacity-30 transition-all hover:bg-emerald-50"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;

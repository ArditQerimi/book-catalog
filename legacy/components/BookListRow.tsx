
import React from 'react';
import { Book } from '../types';
import { ChevronRight, Globe } from 'lucide-react';

interface BookListRowProps {
  book: Book;
  onClick: (book: Book) => void;
}

const BookListRow: React.FC<BookListRowProps> = ({ book, onClick }) => {
  return (
    <div 
      onClick={() => onClick(book)}
      className="group cursor-pointer bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-emerald-50 hover:bg-white hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300 flex items-center gap-6"
    >
      <div className="w-16 h-20 shrink-0 overflow-hidden rounded-lg bg-emerald-50 relative">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] uppercase tracking-widest text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
            {book.category}
          </span>
          <span className="text-xs text-gray-400">• {book.year}</span>
        </div>
        <h3 className="text-base font-bold text-gray-800 line-clamp-1 italic mb-0.5">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 font-medium">by {book.author}</p>
      </div>

      <div className="hidden md:flex items-center gap-8 shrink-0 text-emerald-800/40">
        <div className="flex flex-col items-end">
          <span className="text-[9px] uppercase font-bold tracking-widest">Est. Value</span>
          <span className="text-sm font-bold text-emerald-900">£{book.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">{book.language.split('/')[0]}</span>
        </div>
      </div>

      <div className="shrink-0 p-3 text-emerald-200 group-hover:text-emerald-600 transition-colors">
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
};

export default BookListRow;

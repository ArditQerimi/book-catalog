
import React from 'react';
import { Book } from '../types';
import { BookOpen, Calendar, Globe } from 'lucide-react';

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

      <div className="hidden md:flex items-center gap-6 shrink-0 text-emerald-800/40">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">{book.language.split('/')[0]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">{Math.floor(book.year / 100) + 1}th c.</span>
        </div>
      </div>

      <button className="shrink-0 p-2 text-emerald-700 hover:text-emerald-900 transition-colors">
        <BookOpen className="w-5 h-5" />
      </button>
    </div>
  );
};

export default BookListRow;

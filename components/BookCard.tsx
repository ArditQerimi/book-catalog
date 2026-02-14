
import React from 'react';
import { Book } from '../types';
import { BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <div 
      onClick={() => onClick(book)}
      className="group cursor-pointer bg-white rounded-t-[80px] rounded-b-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-emerald-50/50"
    >
      <div className="relative h-72 overflow-hidden bg-emerald-50">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors duration-500" />
        <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-md transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <BookOpen className="w-5 h-5 text-emerald-700" />
        </div>
      </div>
      <div className="p-5">
        <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-semibold mb-1 block">
          {book.category}
        </span>
        <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-1 leading-tight italic">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{book.author}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">{book.year}</span>
          <button className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:text-emerald-800 transition-colors">
            DETAILS
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

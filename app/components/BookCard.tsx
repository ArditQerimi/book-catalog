import * as React from 'react';
import Link from 'next/link';
import { Book } from '@/types';
import Image from 'next/image';


interface BookCardProps {
  book: Book;
  onBookClick?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link
      href={`/book/${book.id}`}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-emerald-50/50 flex flex-col h-full"
    >
      <div className="relative h-72 overflow-hidden bg-emerald-50">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-emerald-100 flex items-center justify-center">
            <span className="text-emerald-900/20 font-serif">No Cover</span>
          </div>
        )}
        <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors duration-500" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-1 block">
          {book.category}
        </span>
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-1 leading-tight italic">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 font-medium">{book.author}</p>

        <div className="mt-auto pt-4 flex items-end justify-between border-t border-emerald-50">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-emerald-800/40 tracking-widest">Year</span>
            <span className="text-xs text-emerald-900 font-bold">{book.year} CE</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-bold text-emerald-900 italic">£{Number(book.price).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;

import * as React from 'react';
import Badge from './Badge';
import { CheckCircle2 } from 'lucide-react';
import { Book } from '@/types';

interface BookHeroProps {
  book: Book;
}

const BookHero: React.FC<BookHeroProps> = ({ book }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="emerald">{book.category}</Badge>
        <Badge variant="amber">{book.year < 1800 ? 'Classic' : 'Modern'}</Badge>
        <div className="ml-auto flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Verified Vault Entry</span>
        </div>
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-emerald-950 italic mb-4 leading-tight">
        {book.title}
      </h1>
      <p className="text-2xl text-emerald-700/80 font-medium font-serif italic">by {book.author}</p>
    </div>
  );
};

export default BookHero;


import React from 'react';
import { Book } from '../types';
import { X, Calendar, BookText, Globe, Tag, Info, Scroll, Layers } from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md transition-opacity">
      <div className="bg-[#fcfbf4] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[48px] shadow-2xl relative border-8 border-emerald-900/5">
        <button 
          onClick={onClose}
          className="fixed md:absolute top-6 right-6 p-3 bg-white shadow-lg rounded-full text-emerald-800 hover:bg-emerald-50 transition-all z-50 hover:rotate-90"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Image Section - Constrained Container */}
          <div className="w-full lg:w-2/5 p-8 lg:p-12 bg-emerald-50/50 flex items-center justify-center relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor" className="text-emerald-900" />
              </svg>
            </div>
            
            <div className="relative z-10 w-full max-w-[300px] aspect-[2/3] group">
              {/* Image Container Frame */}
              <div className="absolute -inset-4 border border-emerald-200 rounded-xl" />
              <div className="absolute -inset-2 border-2 border-emerald-800/10 rounded-lg" />
              
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="w-full h-full object-cover shadow-[0_20px_50px_rgba(6,95,70,0.3)] rounded-sm ring-1 ring-white/20 transition-transform duration-700 group-hover:scale-[1.02]" 
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 p-8 md:p-12 lg:p-16">
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-widest">
                  {book.category}
                </span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase tracking-widest">
                  {Math.floor(book.year / 100) + 1}th Century
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 italic mb-3 leading-tight">
                {book.title}
              </h2>
              <p className="text-xl text-emerald-700/80 font-medium font-serif">by {book.author}</p>
            </div>

            <div className="space-y-10">
              {/* Brief Description */}
              <section>
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-900/40 mb-4">
                  <Info className="w-4 h-4" />
                  Synopsis
                </h3>
                <p className="text-lg text-emerald-900/80 leading-relaxed italic">
                  "{book.description}"
                </p>
              </section>

              {/* Historical Context */}
              <section className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100/50">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 mb-4">
                  <Scroll className="w-4 h-4" />
                  Historical Significance
                </h3>
                <p className="text-sm text-emerald-800/70 leading-relaxed">
                  {book.historicalContext}
                </p>
              </section>

              {/* Themes & Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section>
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-900/40 mb-4">
                    <Layers className="w-4 h-4" />
                    Key Themes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {book.themes.map(theme => (
                      <span key={theme} className="px-3 py-1.5 bg-white border border-emerald-100 rounded-xl text-xs font-bold text-emerald-800">
                        # {theme}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-900/40 mb-4">
                    <Tag className="w-4 h-4" />
                    Publication Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-emerald-100">
                      <span className="text-emerald-800/40 font-bold uppercase text-[10px]">Publisher</span>
                      <span className="text-emerald-900 font-semibold">{book.publisher}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-emerald-100">
                      <span className="text-emerald-800/40 font-bold uppercase text-[10px]">ISBN</span>
                      <span className="text-emerald-900 font-semibold">{book.isbn}</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-10 border-t border-emerald-100">
                <div className="text-center">
                  <p className="text-[10px] text-emerald-800/40 uppercase font-bold mb-1">Year</p>
                  <p className="text-lg font-bold text-emerald-900 italic">{book.year}</p>
                </div>
                <div className="text-center border-x border-emerald-100">
                  <p className="text-[10px] text-emerald-800/40 uppercase font-bold mb-1">Pages</p>
                  <p className="text-lg font-bold text-emerald-900 italic">{book.pages}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-emerald-800/40 uppercase font-bold mb-1">Language</p>
                  <p className="text-lg font-bold text-emerald-900 italic">{book.language.split('/')[0]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;

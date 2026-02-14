
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Library, Menu, Filter, Sparkles, BookOpen, X, 
  ChevronRight, History as HistoryIcon, Languages, ArrowUpDown, 
  Trash2, LayoutGrid, List, User, Quote, BookCheck, Globe 
} from 'lucide-react';
import { Book, Category, SearchResult, SortOption, FilterState, ViewMode, ActivePage } from './types';
import { MOCK_BOOKS, CATEGORIES } from './constants';
import BookCard from './components/BookCard';
import BookListRow from './components/BookListRow';
import BookDetailModal from './components/BookDetailModal';
import GeometricOverlay from './components/GeometricOverlay';
import { searchBooksSmartly } from './services/geminiService';

const App: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchExplanation, setSearchExplanation] = useState<string | null>(null);
  
  // App Navigation & View States
  const [activePage, setActivePage] = useState<ActivePage>('archive');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Catalog Filter States
  const [sortBy, setSortBy] = useState<SortOption>('Oldest');
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    century: 'All',
    language: 'All'
  });

  // Derived Filter Options for Sidebar
  const centuries = useMemo(() => {
    const years = MOCK_BOOKS.map(b => b.year);
    const uniqueCenturies = new Set<string>();
    years.forEach(y => {
      const c = Math.floor(y / 100) + 1;
      const suffix = (c: number) => {
        if (c > 3 && c < 21) return 'th';
        switch (c % 10) {
          case 1: return "st";
          case 2: return "nd";
          case 3: return "rd";
          default: return "th";
        }
      };
      uniqueCenturies.add(`${c}${suffix(c)} Century`);
    });
    return ['All', ...Array.from(uniqueCenturies).sort()];
  }, []);

  const languages = useMemo(() => {
    const langs = new Set<string>();
    MOCK_BOOKS.forEach(b => {
      b.language.split('/').forEach(l => langs.add(l.trim()));
    });
    return ['All', ...Array.from(langs).sort()];
  }, []);

  // Filter and Sort Logic for the Archive
  const filteredBooks = useMemo(() => {
    let result = [...MOCK_BOOKS];

    if (filters.category !== 'All') {
      result = result.filter(b => b.category === filters.category);
    }

    if (filters.century !== 'All') {
      result = result.filter(b => {
        const c = Math.floor(b.year / 100) + 1;
        const suffix = (val: number) => {
          if (val > 3 && val < 21) return 'th';
          switch (val % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
          }
        };
        return `${c}${suffix(c)} Century` === filters.century;
      });
    }

    if (filters.language !== 'All') {
      result = result.filter(b => b.language.includes(filters.language));
    }

    if (searchQuery && !searchExplanation) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'Oldest') return a.year - b.year;
      if (sortBy === 'Newest') return b.year - a.year;
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [filters, sortBy, searchQuery, searchExplanation]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setActivePage('archive');
    try {
      const result: SearchResult = await searchBooksSmartly(searchQuery);
      setSearchExplanation(result.explanation || null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const resetFilters = () => {
    setFilters({ category: 'All', century: 'All', language: 'All' });
    setSearchQuery('');
    setSearchExplanation(null);
  };

  const removeFilter = (key: keyof FilterState) => {
    setFilters(prev => ({ ...prev, [key]: 'All' }));
  };

  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Partial Page Renderers ---

  const renderArchive = () => (
    <div className="flex flex-col lg:flex-row gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Catalog Sidebar */}
      <aside className="w-full lg:w-72 shrink-0">
        <div className="sticky top-28 space-y-8">
          <div className="bg-white/40 p-6 rounded-[32px] border border-emerald-50/50 shadow-sm">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-900 mb-6 border-b border-emerald-100 pb-2">
              <Filter className="w-3.5 h-3.5" />
              Archive Options
            </h3>

            <div className="space-y-6">
              {/* View Mode Toggle */}
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-600/60 mb-3 tracking-widest">Layout</p>
                <div className="flex p-1 bg-emerald-100/50 rounded-xl gap-1">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-900' : 'text-emerald-800/40 hover:text-emerald-800'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-900' : 'text-emerald-800/40 hover:text-emerald-800'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Specialized Categories */}
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-600/60 mb-3 tracking-widest">Knowledge Field</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilters(f => ({ ...f, category: cat as Category }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        filters.category === cat 
                        ? 'bg-emerald-800 border-emerald-800 text-white shadow-md' 
                        : 'bg-white border-emerald-100 text-emerald-800 hover:border-emerald-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Era Selection */}
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-600/60 mb-3 tracking-widest">Historical Era</p>
                <select 
                  value={filters.century}
                  onChange={(e) => setFilters(f => ({ ...f, century: e.target.value }))}
                  className="w-full bg-white border-emerald-100 border rounded-xl text-xs py-2 px-3 text-emerald-800 font-semibold outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  {centuries.map(c => <option key={c} value={c}>{c === 'All' ? 'All Eras' : c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Sort Menu */}
          <div className="bg-amber-50/50 p-6 rounded-[32px] border border-amber-100/50">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-900 mb-4">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort Sequence
            </h3>
            <div className="flex flex-col gap-2">
              {(['Oldest', 'Newest', 'Title A-Z'] as SortOption[]).map(option => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    sortBy === option ? 'bg-amber-100 text-amber-900' : 'text-amber-800/60 hover:text-amber-900'
                  }`}
                >
                  {option === 'Oldest' ? 'Antiquity First' : option === 'Newest' ? 'Modern Additions' : option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Results Section */}
      <section className="flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-8 min-h-[40px]">
          {(filters.category !== 'All' || filters.century !== 'All' || filters.language !== 'All' || searchQuery) && (
            <button onClick={resetFilters} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-bold hover:bg-red-100 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> RESET FILTERS
            </button>
          )}
          {filters.category !== 'All' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
              {filters.category} <X onClick={() => removeFilter('category')} className="w-3 h-3 cursor-pointer" />
            </span>
          )}
        </div>

        {searchExplanation && (
          <div className="mb-8 p-6 bg-emerald-50/80 backdrop-blur-sm border-l-4 border-emerald-600 rounded-r-2xl italic text-sm text-emerald-900 shadow-sm animate-in fade-in duration-500">
            <div className="flex items-center gap-2 mb-2 not-italic">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-emerald-900 uppercase tracking-widest text-[10px]">Curator's Insight</span>
            </div>
            {searchExplanation}
          </div>
        )}

        {filteredBooks.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} onClick={setSelectedBook} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredBooks.map((book) => (
                <BookListRow key={book.id} book={book} onClick={setSelectedBook} />
              ))}
            </div>
          )
        ) : (
          <div className="py-32 text-center bg-white/20 rounded-[40px] border-2 border-dashed border-emerald-100">
             <HistoryIcon className="w-12 h-12 text-emerald-200 mx-auto mb-6" />
             <h4 className="text-2xl font-bold text-emerald-900 italic mb-2">Archive Search Returned No Records</h4>
             <p className="text-emerald-800/40 max-w-sm mx-auto mb-8">Adjust your filters or try exploring a broader knowledge field.</p>
             <button onClick={resetFilters} className="px-6 py-2 border-2 border-emerald-800 text-emerald-800 font-bold rounded-xl hover:bg-emerald-800 hover:text-white transition-all">
               View Full Collection
             </button>
          </div>
        )}
      </section>
    </div>
  );

  const renderScholars = () => (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto py-12">
      <header className="mb-16 border-b border-emerald-100 pb-10">
        <h2 className="text-5xl font-bold text-emerald-950 italic mb-4">Luminaries of Wisdom</h2>
        <p className="text-lg text-emerald-800/60 font-medium max-w-2xl">A tribute to the thinkers, polymaths, and visionaries whose manuscripts populate our digital archive.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[
          { name: 'Ibn Khaldun', field: 'Historian & Sociologist', bio: 'The pioneer of modern sociology and historiography. His work "The Muqaddimah" remains a seminal text in understanding the rise and fall of civilizations.', era: '14th Century', works: 'The Muqaddimah' },
          { name: 'Al-Ghazali', field: 'Theologian & Philosopher', bio: 'A central figure in Islamic thought who reconciled traditional theology with mystical intuition. His "Revival of Religious Sciences" is a masterpiece of spiritual ethics.', era: '11th Century', works: 'Ihya Ulum al-Din' },
          { name: 'Ibn Sina (Avicenna)', field: 'Physician & Polymath', bio: 'One of the most significant physicians and astronomers of the Islamic Golden Age. His medical canon served as a standard text in Europe for centuries.', era: '10th Century', works: 'The Canon of Medicine' },
          { name: 'Fatima al-Fihri', field: 'Patron of Education', bio: 'The visionary who established the University of Al-Qarawiyyin in Fez, recognized by UNESCO as the oldest continuously operating university in the world.', era: '9th Century', works: 'Al-Qarawiyyin' }
        ].map(scholar => (
          <div key={scholar.name} className="bg-white p-10 rounded-[48px] border border-emerald-50 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-bl-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-emerald-800 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-emerald-900/20">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-emerald-900 italic mb-1">{scholar.name}</h3>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.3em] mb-6">{scholar.field} • {scholar.era}</p>
              <p className="text-emerald-800/70 leading-relaxed italic mb-8">"{scholar.bio}"</p>
              <div className="pt-6 border-t border-emerald-50 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Primary Contribution</span>
                <span className="text-sm font-bold text-emerald-900 italic">{scholar.works}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto py-12">
      <div className="relative mb-20">
        <div className="absolute -left-16 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-emerald-800 to-transparent rounded-full opacity-20 hidden lg:block" />
        <h2 className="text-6xl font-bold text-emerald-950 italic mb-8 leading-tight">The Legacy of <br/><span className="text-amber-600">The Golden Age</span></h2>
        
        <div className="prose prose-emerald lg:prose-xl italic text-emerald-900/80 leading-relaxed space-y-10">
          <p className="text-xl">The Islamic Golden Age was an era of unprecedented cultural and scientific achievement that flourished across North Africa, the Middle East, and Spain from the 8th to the 14th century.</p>
          
          <div className="bg-emerald-950 p-16 rounded-[70px] text-emerald-50 my-20 shadow-[0_30px_100px_rgba(6,95,70,0.3)] relative group overflow-hidden border-8 border-emerald-900/10">
            <div className="absolute inset-0 islamic-pattern opacity-10" />
            <Quote className="w-16 h-16 text-amber-500 mb-8 opacity-40" />
            <p className="text-4xl font-bold mb-8 leading-tight">"Seek knowledge, even as far as China."</p>
            <div className="h-1 w-32 bg-amber-500 mb-6" />
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-400">Classical Adage of the Era</p>
          </div>

          <p>It was in this period that the "House of Wisdom" in Baghdad became the world's most significant center of study, where scholars translated and advanced the knowledge of Greece, Rome, Persia, and India.</p>
          <p>The foundations for algebra, modern medicine, and experimental physics were laid by the very authors whose works we strive to catalog in this library.</p>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto py-12">
      <div className="text-center mb-28">
        <div className="w-24 h-24 bg-emerald-900 rounded-[35px] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl rotate-12">
          <Library className="w-12 h-12" />
        </div>
        <h2 className="text-5xl font-bold text-emerald-950 italic mb-6">The Nur Catalog Project</h2>
        <p className="text-xl text-emerald-800/60 max-w-2xl mx-auto leading-relaxed italic">A digital sanctuary for the preservation and exploration of centuries-old intellectual treasures.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-28">
        {[
          { icon: BookCheck, title: 'Scholarly Curation', text: 'Our catalog is strictly non-commercial, focused solely on the preservation of bibliographic data.' },
          { icon: Globe, title: 'Universal Access', text: 'We believe knowledge is a shared heritage. Our interface is designed for researchers and enthusiasts alike.' },
          { icon: Sparkles, title: 'Digital Heritage', text: 'Using modern technology to frame ancient wisdom, making it accessible to a new generation.' }
        ].map(item => (
          <div key={item.title} className="text-center p-12 bg-white rounded-[50px] border border-emerald-50 shadow-sm transition-transform hover:-translate-y-3">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-800 mx-auto mb-8">
              <item.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-emerald-950 mb-4 italic">{item.title}</h3>
            <p className="text-sm text-emerald-800/50 leading-relaxed font-medium">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 rounded-[60px] p-16 text-center border border-amber-100/50">
         <h3 className="text-3xl font-bold text-amber-900 italic mb-6">Our Vision</h3>
         <p className="text-lg text-amber-800/60 max-w-2xl mx-auto leading-relaxed italic">"Nur" means light. We hope this catalog serves as a beacon, illuminating the profound intellectual contributions of the past to guide the innovations of the future.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative islamic-pattern text-gray-800 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <GeometricOverlay />

      {/* Mobile Sidebar (Drawer) */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-emerald-950/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-80 bg-[#fcfbf4] shadow-2xl transition-transform duration-500 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-20">
               <div className="flex items-center gap-2">
                 <Library className="w-6 h-6 text-emerald-800" />
                 <span className="font-bold italic text-emerald-900 tracking-widest text-[10px] uppercase">Main Menu</span>
               </div>
               <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-emerald-50 rounded-full text-emerald-800"><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex flex-col gap-10 flex-1">
              {[
                { label: 'The Archive', id: 'archive' },
                { label: 'Thinkers', id: 'scholars' },
                { label: 'History', id: 'history' },
                { label: 'About', id: 'about' }
              ].map((link) => (
                <button key={link.id} onClick={() => navigateTo(link.id as ActivePage)} className={`flex items-center justify-between group text-left ${activePage === link.id ? 'text-amber-600' : 'text-emerald-950'}`}>
                  <span className="text-3xl font-bold italic tracking-tight">{link.label}</span>
                  <ChevronRight className={`w-6 h-6 transition-all ${activePage === link.id ? 'text-amber-600 opacity-100' : 'text-emerald-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
                </button>
              ))}
            </nav>
            <div className="mt-auto border-t border-emerald-100 pt-10 text-center">
               <p className="text-[10px] uppercase font-bold text-emerald-800/20 tracking-[0.5em]">Nur Digital 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-emerald-100 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigateTo('archive')}>
          <div className="w-12 h-12 bg-emerald-800 rounded-[18px] flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-[15deg]">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold italic text-emerald-900 leading-none">NUR CATALOG</h1>
            <p className="text-[10px] uppercase tracking-tighter text-emerald-600 font-bold mt-1">Light of Knowledge</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-12">
          {[
            { label: 'Archive', id: 'archive' },
            { label: 'Scholars', id: 'scholars' },
            { label: 'History', id: 'history' },
            { label: 'About', id: 'about' }
          ].map(link => (
            <button 
              key={link.id} 
              onClick={() => navigateTo(link.id as ActivePage)} 
              className={`text-sm font-bold transition-all relative py-2 ${activePage === link.id ? 'text-emerald-950' : 'text-emerald-900/40 hover:text-emerald-900'}`}
            >
              {link.label}
              {activePage === link.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />}
            </button>
          ))}
        </div>

        <button onClick={() => setIsMenuOpen(true)} className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl hover:bg-emerald-100 transition-all border border-emerald-100/50 shadow-sm">
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {activePage === 'archive' && (
          <header className="mb-24 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
            <h2 className="text-5xl md:text-8xl font-bold text-emerald-950 mb-12 leading-tight italic max-w-4xl mx-auto">
              Seek the <span className="text-amber-600">Hidden</span> <br /> Gems of History.
            </h2>
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
              <div className="absolute inset-0 bg-emerald-800/10 rounded-[40px] blur-3xl group-focus-within:bg-emerald-800/20 transition-all" />
              <div className="relative flex items-center bg-white border-2 border-emerald-800/5 rounded-[40px] p-2 md:p-3 pr-2 md:pr-6 shadow-[0_20px_50px_rgba(6,95,70,0.1)] focus-within:border-emerald-800/20 transition-all">
                <Search className="w-5 h-5 md:w-6 md:h-6 ml-3 md:ml-6 text-emerald-800/30 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Enter keywords..." 
                  value={searchQuery} 
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (searchExplanation) setSearchExplanation(null);
                  }} 
                  className="flex-1 bg-transparent border-none focus:ring-0 py-3 md:py-5 px-3 md:px-6 text-base md:text-xl text-emerald-950 placeholder:text-gray-300" 
                />
                <button 
                  type="submit" 
                  disabled={isSearching} 
                  className="bg-emerald-800 text-white px-5 md:px-12 py-3 md:py-5 rounded-[28px] md:rounded-[32px] font-bold hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/10 disabled:opacity-50 text-sm md:text-base whitespace-nowrap"
                >
                  {isSearching ? 'SEEKING...' : 'DISCOVER'}
                </button>
              </div>
            </form>
          </header>
        )}

        {/* Dynamic Route Rendering */}
        {activePage === 'archive' && renderArchive()}
        {activePage === 'scholars' && renderScholars()}
        {activePage === 'history' && renderHistory()}
        {activePage === 'about' && renderAbout()}
      </main>

      {/* Footer Section */}
      <footer className="bg-emerald-950 text-white pt-28 pb-16 px-6 overflow-hidden relative mt-24">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 relative z-10">
           <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-4 mb-10">
                <Library className="w-10 h-10 text-amber-500" />
                <h2 className="text-3xl font-bold italic tracking-tight">NUR</h2>
             </div>
             <p className="text-emerald-200/40 italic leading-relaxed text-sm">We are custodians of the written word, dedicated to the aesthetic preservation of humanity’s most profound intellectual legacies.</p>
           </div>
           
           <div>
              <h4 className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-10">Directory</h4>
              <ul className="space-y-5 text-xs font-semibold text-emerald-200/60">
                <li className="hover:text-amber-400 cursor-pointer transition-colors" onClick={() => navigateTo('archive')}>The Archive</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors" onClick={() => navigateTo('scholars')}>Historical Thinkers</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors" onClick={() => navigateTo('history')}>Our Shared History</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors" onClick={() => navigateTo('about')}>About The Project</li>
              </ul>
           </div>
           
           <div>
              <h4 className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-10">Affiliates</h4>
              <ul className="space-y-5 text-xs font-semibold text-emerald-200/60">
                <li className="hover:text-amber-400 cursor-pointer transition-colors">Library of Alexandria (Digital)</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors">Fez Heritage Society</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors">Baghdad Manuscript Center</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors">UNESCO Cultural Memory</li>
              </ul>
           </div>

           <div className="bg-white/5 p-10 rounded-[50px] border border-white/10 backdrop-blur-md">
              <h4 className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-5">Weekly Insight</h4>
              <p className="text-xs text-emerald-100 mb-8 leading-relaxed italic">"Receive a curated highlight of an ancient text directly in your inbox."</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Researcher email" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs focus:ring-1 focus:ring-amber-500 outline-none" />
                <button className="w-14 h-14 bg-amber-500 text-emerald-950 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform"><ChevronRight className="w-6 h-6" /></button>
              </div>
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-28 pt-10 border-t border-white/5 text-center">
           <p className="text-[11px] tracking-[0.6em] uppercase text-emerald-200/10 font-bold italic">Knowledge is a trust for the future</p>
        </div>
      </footer>

      {/* Book Detail Viewer */}
      <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
};

export default App;


import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Category, SearchResult, SortOption, FilterState, ViewMode, GroundingSource } from '../types';
import ArchiveSidebar from '../components/ArchiveSidebar';
import LibrarianInsight from '../components/LibrarianInsight';
import ArchiveTools from '../components/ArchiveTools';
import EmptyArchive from '../components/EmptyArchive';
import ArchiveHeader from '../components/ArchiveHeader';
import ArchiveList from '../components/ArchiveList';
import Pagination from '../components/Pagination';
import { searchBooksSmartly } from '../services/geminiService';

interface HomePageProps {
  books: Book[];
}

const BOOKS_PER_PAGE = 9;

const getCenturyString = (year: number) => {
  const c = Math.floor(year / 100) + 1;
  const suffix = (val: number) => {
    if (val > 3 && val < 21) return 'th';
    switch (val % 10) {
      case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th";
    }
  };
  return `${c}${suffix(c)} Century`;
};

const HomePage: React.FC<HomePageProps> = ({ books = [] }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchExplanation, setSearchExplanation] = useState<string | null>(null);
  const [searchSources, setSearchSources] = useState<GroundingSource[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('Oldest');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    century: 'All',
    language: 'All',
    theme: 'All'
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

  const filterOptions = useMemo(() => {
    const centuries = new Set<string>();
    const languages = new Set<string>();
    const themes = new Set<string>();
    books.forEach(book => {
      centuries.add(getCenturyString(book.year));
      book.language.split('/').forEach(l => languages.add(l.trim()));
      book.themes.forEach(t => themes.add(t));
    });
    return {
      centuries: Array.from(centuries).sort((a, b) => parseInt(a) - parseInt(b)),
      languages: Array.from(languages).sort(),
      themes: Array.from(themes).sort().slice(0, 15) // Limit to top 15 for UI cleanliness
    };
  }, [books]);

  const filteredBooks = useMemo(() => {
    let result = [...books];
    if (filters.category !== 'All') result = result.filter(b => b.category === filters.category);
    if (filters.century !== 'All') result = result.filter(b => getCenturyString(b.year) === filters.century);
    if (filters.language !== 'All') result = result.filter(b => b.language.includes(filters.language));
    if (filters.theme !== 'All') result = result.filter(b => b.themes.includes(filters.theme));
    
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
  }, [books, filters, sortBy, searchQuery, searchExplanation]);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    return filteredBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);
  }, [filteredBooks, currentPage]);

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);

  const handleGlobalSearch = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchExplanation(null);
    setSearchSources([]);
    try {
      const result: SearchResult = await searchBooksSmartly(searchQuery);
      setSearchExplanation(result.explanation || null);
      if (result.sources) setSearchSources(result.sources);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const resetFilters = () => {
    setFilters({ category: 'All', century: 'All', language: 'All', theme: 'All' });
    setSearchQuery('');
    setSearchExplanation(null);
    setSearchSources([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.category !== 'All' || filters.century !== 'All' || filters.language !== 'All' || filters.theme !== 'All' || !!searchQuery;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <ArchiveHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleGlobalSearch}
        isSearching={isSearching}
      />

      <div className="flex flex-col lg:flex-row gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <ArchiveSidebar 
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filterOptions={filterOptions}
        />

        <section className="flex-1">
          <ArchiveTools 
            hasFilters={hasActiveFilters}
            onReset={resetFilters}
            filteredCount={filteredBooks.length}
            totalCount={books.length}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {searchExplanation && (
            <LibrarianInsight explanation={searchExplanation} sources={searchSources} />
          )}

          {paginatedBooks.length > 0 ? (
            <>
              <ArchiveList 
                books={paginatedBooks} 
                viewMode={viewMode} 
                onBookClick={(b) => navigate(`/book/${b.id}`)} 
              />
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </>
          ) : (
            <EmptyArchive onReset={resetFilters} />
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;

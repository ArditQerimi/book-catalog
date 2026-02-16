"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Book, Category, SortOption, FilterState, ViewMode } from '@/types';
import ArchiveSidebar from './ArchiveSidebar';
import ArchiveTools from './ArchiveTools';
import EmptyArchive from './EmptyArchive';
import ArchiveHeader from './ArchiveHeader';
import ArchiveList from './ArchiveList';
import Pagination from './Pagination';

interface ArchiveContainerProps {
    initialBooks: Book[];
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

const ArchiveContainer: React.FC<ArchiveContainerProps> = ({ initialBooks = [] as Book[] }) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
    const [sortBy, setSortBy] = React.useState<SortOption>('Oldest');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [filters, setFilters] = React.useState<FilterState>({
        category: 'All',
        century: 'All',
        language: 'All',
        theme: 'All'
    });
    const itemsPerPage = BOOKS_PER_PAGE;

    React.useEffect(() => {
        setCurrentPage(1);
    }, [filters, searchQuery, sortBy]);

    const filterOptions = React.useMemo(() => {
        const centuries = new Set<string>();
        const languages = new Set<string>();
        const themes = new Set<string>();
        initialBooks.forEach(book => {
            centuries.add(getCenturyString(book.year));
            book.language.split('/').forEach(l => languages.add(l.trim()));
            book.themes.forEach(t => themes.add(t));
        });
        return {
            centuries: Array.from(centuries).sort((a, b) => parseInt(a) - parseInt(b)),
            languages: Array.from(languages).sort(),
            themes: Array.from(themes).sort().slice(0, 15) // Limit to top 15 for UI cleanliness
        };
    }, [initialBooks]);

    const filteredBooks = React.useMemo(() => {
        let result = initialBooks;

        if (filters.category !== 'All') result = result.filter(b => b.category === filters.category);
        if (filters.century !== 'All') result = result.filter(b => getCenturyString(b.year) === filters.century);
        if (filters.language !== 'All') result = result.filter(b => b.language.includes(filters.language));
        if (filters.theme !== 'All') result = result.filter(b => b.themes.includes(filters.theme));

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(b =>
                b.title.toLowerCase().includes(q) ||
                b.author.toLowerCase().includes(q) ||
                b.description.toLowerCase().includes(q)
            );
        }
        return result;
    }, [initialBooks, filters, searchQuery]);

    const sortedBooks = React.useMemo(() => {
        const result = [...filteredBooks];
        if (sortBy === 'Oldest') return result.sort((a, b) => a.year - b.year);
        if (sortBy === 'Newest') return result.sort((a, b) => b.year - a.year);
        return result.sort((a, b) => a.title.localeCompare(b.title));
    }, [filteredBooks, sortBy]);

    const paginatedBooks = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedBooks.slice(start, start + itemsPerPage);
    }, [sortedBooks, currentPage]);

    const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);

    const handleGlobalSearch = (e: React.FormEvent) => {
        if (e) e.preventDefault();
        // Native filtering is reactively handled by useMemo
    };

    const resetFilters = () => {
        setFilters({ category: 'All', century: 'All', language: 'All', theme: 'All' });
        setSearchQuery('');
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
                isSearching={false}
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
                        totalCount={initialBooks.length}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />


                    {paginatedBooks.length > 0 ? (
                        <>
                            <ArchiveList
                                books={paginatedBooks}
                                viewMode={viewMode}
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

export default ArchiveContainer;

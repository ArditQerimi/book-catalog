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


const ArchiveContainer: React.FC<ArchiveContainerProps> = ({ initialBooks = [] as Book[] }) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
    const [sortBy, setSortBy] = React.useState<SortOption>('Oldest');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [filters, setFilters] = React.useState<FilterState>({
        author: '',
        maxPages: 1000
    });
    const itemsPerPage = BOOKS_PER_PAGE;

    React.useEffect(() => {
        setCurrentPage(1);
    }, [filters, searchQuery, sortBy]);


    const filteredBooks = React.useMemo(() => {
        let result = initialBooks;

        // Filter by Author if set
        if (filters.author) {
            result = result.filter(b => b.author.toLowerCase().includes(filters.author!.toLowerCase()));
        }

        // Filter by Max Pages if set
        if (filters.maxPages) {
            result = result.filter(b => b.pages <= filters.maxPages!);
        }

        // Filter by Search Query (Title only as per user request for "Title, Author, Pages")
        // Although the user said "filters with title, author...", usually search bar is for title.
        // I will make the search query filter strictly by Title now.
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(b => b.title.toLowerCase().includes(q));
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
        setFilters({ author: '', maxPages: 1000 });
        setSearchQuery('');
        setCurrentPage(1);
    };

    const hasActiveFilters = !!filters.author || (filters.maxPages !== 1000) || !!searchQuery;

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
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
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

"use client";

import * as React from 'react';
import { Book, ViewMode } from '@/types';
import BookCard from './BookCard';
import BookListRow from './BookListRow';

interface ArchiveListProps {
  books: Book[];
  viewMode: ViewMode;
}

const ArchiveList: React.FC<ArchiveListProps> = ({ books, viewMode }) => {
  return (
    <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" : "flex flex-col gap-3"}>
      {books.map((book) => (
        viewMode === 'grid'
          ? <BookCard key={book.id} book={book} />
          : <BookListRow key={book.id} book={book} />
      ))}
    </div>
  );
};

export default ArchiveList;

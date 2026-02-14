
export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  description: string;
  historicalContext: string;
  themes: string[];
  coverImage: string;
  isbn: string;
  pages: number;
  language: string;
  publisher: string;
}

export type Category = 'All' | 'Philosophy' | 'Theology' | 'History' | 'Literature' | 'Science' | 'Art';

export interface SearchResult {
  books: Book[];
  explanation?: string;
}

export type SortOption = 'Oldest' | 'Newest' | 'Title A-Z';

export interface FilterState {
  category: Category;
  century: string;
  language: string;
}

export type ViewMode = 'grid' | 'list';
export type ActivePage = 'archive' | 'scholars' | 'history' | 'about';

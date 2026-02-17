
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
  price: string;
}

export type Category = 'All' | 'Philosophy' | 'Theology' | 'History' | 'Literature' | 'Science' | 'Art';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SearchResult {
  books: Book[];
  explanation?: string;
  sources?: GroundingSource[];
}

export type SortOption = 'Oldest' | 'Newest' | 'Title A-Z';

export interface FilterState {
  author?: string;
  maxPages?: number;
}

export type ViewMode = 'grid' | 'list';
export type ActivePage = 'archive' | 'scholars' | 'history' | 'about' | 'admin' | 'login';

import { Book, SearchResult } from "../types";
import { MOCK_BOOKS } from "../constants";

export const searchBooksSmartly = async (query: string): Promise<SearchResult> => {
  if (!query) return { books: MOCK_BOOKS };

  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, books: MOCK_BOOKS }),
    });

    if (!response.ok) {
      throw new Error(`Search API returned ${response.status}`);
    }

    const data = await response.json();
    const matchedBooks = MOCK_BOOKS.filter(book => data.bookIds.includes(book.id));

    // If AI fails to find anything, do a simple string search
    if (matchedBooks.length === 0) {
       const lowerQuery = query.toLowerCase();
       return {
         books: MOCK_BOOKS.filter(b =>
            b.title.toLowerCase().includes(lowerQuery) ||
            b.author.toLowerCase().includes(lowerQuery) ||
            b.category.toLowerCase().includes(lowerQuery)
         ),
         explanation: "Direct keyword matches from the catalog."
       };
    }

    return {
      books: matchedBooks,
      explanation: data.explanation
    };
  } catch (error) {
    console.error("Search error:", error);
    // Fallback to simple filtering
    const lowerQuery = query.toLowerCase();
    return {
      books: MOCK_BOOKS.filter(b =>
        b.title.toLowerCase().includes(lowerQuery) ||
        b.author.toLowerCase().includes(lowerQuery)
      ),
      explanation: "Fallback search results based on title and author."
    };
  }
};

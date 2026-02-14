
import { GoogleGenAI, Type } from "@google/genai";
import { Book, SearchResult } from "../types";
import { MOCK_BOOKS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const searchBooksSmartly = async (query: string): Promise<SearchResult> => {
  if (!query) return { books: MOCK_BOOKS };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search through this book catalog: ${JSON.stringify(MOCK_BOOKS)}. 
      User query: "${query}". 
      Return a JSON list of book IDs that match the query conceptually or by title/author. 
      Also provide a short explanation of why these books were chosen.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bookIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "IDs of matching books"
            },
            explanation: {
              type: Type.STRING,
              description: "Brief reason for the search results"
            }
          },
          required: ["bookIds", "explanation"]
        }
      }
    });

    const data = JSON.parse(response.text);
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
    console.error("Gemini search error:", error);
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

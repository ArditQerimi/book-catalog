
import { GoogleGenAI, Type } from "@google/genai";
import { Book, SearchResult, GroundingSource } from "../types";
import { MOCK_BOOKS } from "../constants";

export const searchBooksSmartly = async (query: string): Promise<SearchResult> => {
  if (!query) return { books: MOCK_BOOKS };

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // We use gemini-3-flash-preview which supports googleSearch grounding
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the chief librarian of the Nur Catalog. 
      Search through this internal catalog: ${JSON.stringify(MOCK_BOOKS)}. 
      User query: "${query}". 
      If the query asks for books NOT in our catalog, use Google Search to find famous Islamic manuscripts or scholars that fit.
      Return a JSON object with:
      1. "bookIds": IDs of matching books from our internal list.
      2. "explanation": A brief, elegant librarian-style response.
      3. "externalSuggestions": If you found real books via search that we don't have, list their titles and authors.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bookIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "IDs of matching books from the provided catalog"
            },
            explanation: {
              type: Type.STRING,
              description: "Brief reason for the search results"
            },
            externalSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Titles of books found on the web not in local DB"
            }
          },
          required: ["bookIds", "explanation"]
        }
      }
    });

    // Extract grounding chunks for citations as per requirements
    const sources: GroundingSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    const data = JSON.parse(response.text);
    const matchedBooks = MOCK_BOOKS.filter(book => data.bookIds.includes(book.id));
    
    return {
      books: matchedBooks.length > 0 ? matchedBooks : MOCK_BOOKS.slice(0, 3), // Fallback if AI found only external stuff
      explanation: data.explanation,
      sources: sources.length > 0 ? sources : undefined
    };
  } catch (error) {
    console.error("Gemini search error:", error);
    const lowerQuery = query.toLowerCase();
    return {
      books: MOCK_BOOKS.filter(b => 
        b.title.toLowerCase().includes(lowerQuery) || 
        b.author.toLowerCase().includes(lowerQuery)
      ),
      explanation: "Direct search results from our local repository."
    };
  }
};

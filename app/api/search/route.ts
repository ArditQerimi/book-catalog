
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";
import { db } from '@/lib/db';
import { books } from '@/schema';
import { SearchResult, GroundingSource } from '@/types';

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(request: NextRequest) {
  const { query } = await request.json();

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  if (!genAI) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
  }

  try {
    const allBooks = await db.select().from(books);
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: `You are the chief librarian of the Nur Catalog. 
      Search through this internal catalog: ${JSON.stringify(allBooks)}. 
      User query: "${query}". 
      If the query asks for books NOT in our catalog, use Google Search to find famous Islamic manuscripts or scholars that fit.
      Return a JSON object with:
      1. "bookIds": IDs of matching books from our internal list.
      2. "explanation": A brief, elegant librarian-style response.
      3. "externalSuggestions": If you found real books via search that we don't have, list their titles and authors.`,
      tools: [{ googleSearch: {} }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);

    const sources: GroundingSource[] = [];
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata?.webSearchQueries?.length) {
      groundingMetadata.groundingAttributions?.forEach((attribution: any) => {
        if (attribution.web) {
          sources.push({
            title: attribution.web.title,
            uri: attribution.web.uri
          });
        }
      });
    }

    const searchResult: SearchResult = {
      explanation: data.explanation,
      sources: sources.length > 0 ? sources : undefined
    };

    return NextResponse.json(searchResult);
  } catch (error) {
    console.error("Gemini search error:", error);
    return NextResponse.json({ error: 'Failed to perform smart search' }, { status: 500 });
  }
}

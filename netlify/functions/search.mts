import type { Context, Config } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({});

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { query, books } = await req.json();

  if (!query || !books) {
    return new Response(JSON.stringify({ error: "Missing query or books" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Search through this book catalog: ${JSON.stringify(books)}.
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
              description: "IDs of matching books",
            },
            explanation: {
              type: Type.STRING,
              description: "Brief reason for the search results",
            },
          },
          required: ["bookIds", "explanation"],
        },
      },
    });

    return new Response(response.text, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return new Response(
      JSON.stringify({ error: "AI search failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const config: Config = {
  path: "/api/search",
};

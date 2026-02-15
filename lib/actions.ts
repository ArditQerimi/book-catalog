
import { Book } from "../types";
import { MOCK_BOOKS } from "../constants";
import { GoogleGenAI } from "@google/genai";

const DB_KEY = 'nur_archive_db_v2';
const COOKIE_NAME = 'nur_session';

// Helper to simulate a server-side cookie store
const cookies = {
  get: (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  },
  set: (name: string, value: string, days: number = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  },
  delete: (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};

const getDb = (): Book[] => {
  if (typeof window === 'undefined') return MOCK_BOOKS;
  const stored = localStorage.getItem(DB_KEY);
  if (!stored) {
    localStorage.setItem(DB_KEY, JSON.stringify(MOCK_BOOKS));
    return MOCK_BOOKS;
  }
  return JSON.parse(stored);
};

const saveToDb = (data: Book[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  }
};

/**
 * AUTH ACTION: verifySession
 * Mimics a middleware check
 */
export async function verifySession(): Promise<boolean> {
  const session = cookies.get(COOKIE_NAME);
  return session === 'authenticated_scribe';
}

/**
 * AUTH ACTION: loginAction
 */
export async function loginAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const username = formData.get('username');
  const password = formData.get('password');

  // Updated credentials to admin / admin
  if (username === 'admin' && password === 'admin') {
    cookies.set(COOKIE_NAME, 'authenticated_scribe');
    return { success: true };
  }

  return { success: false, error: "Invalid credentials recorded in the ledger." };
}

/**
 * AUTH ACTION: logoutAction
 */
export async function logoutAction(): Promise<void> {
  cookies.delete(COOKIE_NAME);
}

export async function getBooksAction(): Promise<Book[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return getDb();
}

export async function createBookAction(formData: FormData): Promise<{ success: boolean; book?: Book; error?: string }> {
  // Middleware check inside action
  if (!(await verifySession())) return { success: false, error: "Unauthorized" };

  try {
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const year = parseInt(formData.get('year') as string);
    const coverImage = formData.get('coverImage') as string;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a 2-sentence historical significance and 3 short themes for the book "${title}" by ${author}. Return as JSON with keys "context" and "themes".`,
      config: { responseMimeType: "application/json" }
    });

    const aiData = JSON.parse(response.text);
    
    // Add missing 'price' property to satisfy the Book interface
    const newBook: Book = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      author,
      category,
      year,
      description: `A classical exploration of ${category.toLowerCase()} principles.`,
      historicalContext: aiData.context || "A vital contribution to the intellectual history of the era.",
      themes: aiData.themes || [category, "Philosophy"],
      coverImage: coverImage || "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
      isbn: `978-${Math.floor(Math.random() * 1000000000)}`,
      pages: Math.floor(Math.random() * 400) + 150,
      language: "English / Arabic",
      publisher: "Nur Digital Press",
      price: Math.floor(Math.random() * 50) + 15
    };

    const currentBooks = getDb();
    saveToDb([newBook, ...currentBooks]);
    return { success: true, book: newBook };
  } catch (err) {
    return { success: false, error: "Database error: Failed to enshrine manuscript." };
  }
}

export async function updateBookAction(id: string, formData: FormData): Promise<{ success: boolean; book?: Book; error?: string }> {
  if (!(await verifySession())) return { success: false, error: "Unauthorized" };

  try {
    const currentBooks = getDb();
    const index = currentBooks.findIndex(b => b.id === id);
    if (index === -1) throw new Error("Book not found");

    const updatedBook = {
      ...currentBooks[index],
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      category: formData.get('category') as string,
      year: parseInt(formData.get('year') as string),
    };

    if (formData.get('coverImage')) {
        updatedBook.coverImage = formData.get('coverImage') as string;
    }

    currentBooks[index] = updatedBook;
    saveToDb([...currentBooks]);
    return { success: true, book: updatedBook };
  } catch (err) {
    return { success: false, error: "Database error: Failed to update archive entry." };
  }
}

export async function deleteBookAction(id: string): Promise<boolean> {
  if (!(await verifySession())) return false;
  const currentBooks = getDb();
  const filtered = currentBooks.filter(b => b.id !== id);
  saveToDb(filtered);
  return true;
}

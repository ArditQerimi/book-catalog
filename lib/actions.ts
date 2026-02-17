"use server";

import { db } from "./db";
import { books, users, categories, authorsInfo, languages } from "../schema";
import { eq, desc, asc } from "drizzle-orm";
import { cookies as nextCookies } from "next/headers";
import { NextResponse, NextRequest } from 'next/server';

import { Book } from "../types";
import * as bcrypt from "bcrypt";
import { verifySession, encrypt } from './auth';
export { verifySession };
import { uploadToSupabase, deleteFromSupabase } from "./supabase-storage";

const COOKIE_NAME = 'nur_session';

/**
 * AUTH ACTION: loginAction
 */
export async function loginAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);

  const isMatch = user ? await bcrypt.compare(password, user.password) : false;

  if (user && isMatch) {
    // Generate Secure JWT
    const sessionToken = await encrypt({ userId: user.id });

    const cookieStore = await nextCookies();
    cookieStore.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return { success: true };
  }

  return { success: false, error: "Invalid credentials recorded in the ledger." };
}

/**
 * AUTH ACTION: logoutAction
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await nextCookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin route
  if (pathname.startsWith('/admin')) {
    const user = await verifySession();
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect authenticated users away from /login
  if (pathname.startsWith('/login')) {
    const user = await verifySession();
    if (user) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export async function getBooksAction() {
  return db.select().from(books).orderBy(desc(books.createdAt));
}

export async function createBookAction(formData: FormData): Promise<{ success: boolean; book?: any; error?: string }> {
  const user = await verifySession();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const year = parseInt(formData.get('year') as string);
    const coverImage = formData.get('coverImage') as string;

    const [newBook] = await db.insert(books).values({
      title,
      author,
      category,
      year,
      description: `A classical exploration of ${category.toLowerCase()} principles.`,
      historicalContext: "A vital contribution to the intellectual history of the era.",
      themes: [category, "Philosophy"],
      coverImage: coverImage || "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
      isbn: `978-${Math.floor(Math.random() * 1000000000)}`,
      pages: Math.floor(Math.random() * 400) + 150,
      language: "English / Arabic",
      publisher: "Nur Digital Press",
      price: (Math.floor(Math.random() * 50) + 15).toString(),
      userId: user.id
    } as any).returning();

    return { success: true, book: newBook };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Database error: Failed to enshrine manuscript." };
  }
}

export async function updateBookAction(id: string, formData: FormData): Promise<{ success: boolean; book?: any; error?: string }> {
  const user = await verifySession();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const year = parseInt(formData.get('year') as string);
    const coverImage = formData.get('coverImage') as string;

    const [updatedBook] = await db.update(books)
      .set({
        title,
        author,
        category,
        year,
        coverImage: coverImage || undefined,
        userId: user.id // Track who last edited
      } as any)
      .where(eq(books.id, id))
      .returning();

    if (!updatedBook) throw new Error("Book not found");

    return { success: true, book: updatedBook };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Database error: Failed to update archive entry." };
  }
}

export async function deleteBookAction(id: string): Promise<boolean> {
  const user = await verifySession();
  if (!user) return false;

  const [book] = await db.select().from(books).where(eq(books.id, id)).limit(1);
  if (book?.coverImage && book.coverImage.includes('supabase.co')) {
    await deleteFromSupabase(book.coverImage);
  }

  await db.delete(books).where(eq(books.id, id));
  return true;
}

export async function uploadImageAction(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const user = await verifySession();
  if (!user) return { success: false, error: "Unauthorized" };

  const file = formData.get('file') as File;
  if (!file) return { success: false, error: "No file provided" };

  return await uploadToSupabase(file);
}

// --- CATEGORY ACTIONS ---
export async function getCategoriesAction() {
  return db.select().from(categories).orderBy(asc(categories.name));
}

export async function createCategoryAction(formData: FormData) {
  const user = await verifySession();
  if (!user) return { success: false, error: "Unauthorized" };

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  try {
    await db.insert(categories).values({ name, description });
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to create category." };
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const user = await verifySession();
  if (!user) return { success: false, error: "Unauthorized" };

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  try {
    await db.update(categories).set({ name, description }).where(eq(categories.id, id));
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to update category." };
  }
}

export async function deleteCategoryAction(id: string) {
  const user = await verifySession();
  if (!user) return { success: false };
  await db.delete(categories).where(eq(categories.id, id));
  return { success: true };
}

// --- AUTHOR ACTIONS ---
export async function getAuthorsInfoAction() {
  return db.select().from(authorsInfo).orderBy(asc(authorsInfo.name));
}

export async function createAuthorInfoAction(formData: FormData) {
  const user = await verifySession();
  if (!user) return { success: false, error: "Unauthorized" };

  const name = formData.get('name') as string;
  const bio = formData.get('bio') as string;
  const image = formData.get('image') as string;

  try {
    await db.insert(authorsInfo).values({ name, bio, image });
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to create author." };
  }
}

export async function updateAuthorInfoAction(id: string, formData: FormData) {
  const user = await verifySession();
  if (!user) return { success: false, error: "Unauthorized" };

  const name = formData.get('name') as string;
  const bio = formData.get('bio') as string;
  const image = formData.get('image') as string;
  const deathYear = formData.get('deathYear') ? parseInt(formData.get('deathYear') as string) : null;

  try {
    const [oldAuthor] = await db.select().from(authorsInfo).where(eq(authorsInfo.id, id)).limit(1);

    // Cleanup old image if we are setting a new one
    if (image && oldAuthor?.image && oldAuthor.image !== image && oldAuthor.image.includes('supabase.co')) {
      await deleteFromSupabase(oldAuthor.image);
    }

    await db.update(authorsInfo).set({ name, bio, image, deathYear }).where(eq(authorsInfo.id, id));
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to update author." };
  }
}

export async function deleteAuthorInfoAction(id: string) {
  const user = await verifySession();
  if (!user) return { success: false };

  const [author] = await db.select().from(authorsInfo).where(eq(authorsInfo.id, id)).limit(1);
  if (author?.image && author.image.includes('supabase.co')) {
    await deleteFromSupabase(author.image);
  }

  await db.delete(authorsInfo).where(eq(authorsInfo.id, id));
  return { success: true };
}

// --- LANGUAGE ACTIONS ---
export async function getLanguagesAction() {
  return db.select().from(languages).orderBy(asc(languages.name));
}

export async function createLanguageAction(formData: FormData) {
  const user = await verifySession();
  if (!user) return { success: false, error: "Unauthorized" };

  const name = formData.get('name') as string;
  const code = formData.get('code') as string;

  try {
    await db.insert(languages).values({ name, code });
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to create language." };
  }
}

export async function updateLanguageAction(id: string, formData: FormData) {
  const user = await verifySession();
  if (!user) return { success: false, error: "Unauthorized" };

  const name = formData.get('name') as string;
  const code = formData.get('code') as string;

  try {
    await db.update(languages).set({ name, code }).where(eq(languages.id, id));
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to update language." };
  }
}

export async function deleteLanguageAction(id: string) {
  const user = await verifySession();
  if (!user) return { success: false };
  await db.delete(languages).where(eq(languages.id, id));
  return { success: true };
}

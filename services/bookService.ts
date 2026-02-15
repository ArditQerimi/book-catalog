
import { Book } from "../types";
import { MOCK_BOOKS } from "../constants";

/**
 * In a real Next.js environment, this service would use Prisma or Drizzle 
 * to interact with a real PostgreSQL/MySQL database.
 */

export const bookService = {
  // Simulate fetching all books from DB
  async getAllBooks(): Promise<Book[]> {
    // Simulated delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_BOOKS;
  },

  // Simulate storing an image
  async uploadImage(file: File): Promise<{ url: string; publicId: string }> {
    console.log("Uploading to Cloudinary/S3...", file.name);
    // In production:
    // const formData = new FormData();
    // formData.append("file", file);
    // const res = await fetch("/api/upload", { method: "POST", body: formData });
    return { 
      url: URL.createObjectURL(file), 
      publicId: `idx_${Math.random().toString(36).substr(2, 9)}` 
    };
  },

  // Database persistence simulation
  async createBook(data: Partial<Book>): Promise<Book> {
    const newBook = {
      ...MOCK_BOOKS[0], // base defaults
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    } as Book;
    console.log("Prisma: book created in DB", newBook.id);
    return newBook;
  }
};

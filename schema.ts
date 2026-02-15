
import { pgTable, text, integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const books = pgTable("books", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  description: text("description").notNull(),
  historicalContext: text("historical_context").notNull(),
  coverImage: text("cover_image").notNull(),
  isbn: varchar("isbn", { length: 50 }).unique().notNull(),
  pages: integer("pages").notNull(),
  language: varchar("language", { length: 100 }).notNull(),
  publisher: varchar("publisher", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;

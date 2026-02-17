
import { pgTable, text, integer, timestamp, varchar, numeric } from "drizzle-orm/pg-core";


export const books = pgTable("books", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
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
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  themes: text("themes").array().notNull().default([]),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().$default(() => crypto.randomUUID()),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).notNull().default('user'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scholars = pgTable("scholars", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  title: text("title").notNull(),
  period: varchar("period", { length: 255 }).notNull(),
  bio: text("bio").notNull(),
  image: text("image").notNull(),
  specialization: text("specialization").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});


export const categories = pgTable("categories", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const authorsInfo = pgTable("authors_info", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  bio: text("bio"),
  image: text("image"),
  deathYear: integer("death_year"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const languages = pgTable("languages", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 100 }).notNull().unique(),
  code: varchar("code", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Scholar = typeof scholars.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type AuthorInfo = typeof authorsInfo.$inferSelect;
export type Language = typeof languages.$inferSelect;

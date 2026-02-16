import { pgTable, unique, varchar, text, timestamp, foreignKey, integer, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	username: varchar({ length: 100 }).notNull(),
	password: text().notNull(),
	role: varchar({ length: 50 }).default('user').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_username_unique").on(table.username),
]);

export const books = pgTable("books", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	title: text().notNull(),
	author: text().notNull(),
	category: varchar({ length: 100 }).notNull(),
	year: integer().notNull(),
	description: text().notNull(),
	historicalContext: text("historical_context").notNull(),
	coverImage: text("cover_image").notNull(),
	isbn: varchar({ length: 50 }).notNull(),
	pages: integer().notNull(),
	language: varchar({ length: 100 }).notNull(),
	publisher: varchar({ length: 255 }).notNull(),
	price: numeric({ precision: 10, scale:  2 }).default('0').notNull(),
	themes: text().array().default([""]).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	userId: varchar("user_id", { length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "books_user_id_users_id_fk"
		}),
	unique("books_isbn_unique").on(table.isbn),
]);

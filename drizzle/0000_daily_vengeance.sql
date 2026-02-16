-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" text NOT NULL,
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"year" integer NOT NULL,
	"description" text NOT NULL,
	"historical_context" text NOT NULL,
	"cover_image" text NOT NULL,
	"isbn" varchar(50) NOT NULL,
	"pages" integer NOT NULL,
	"language" varchar(100) NOT NULL,
	"publisher" varchar(255) NOT NULL,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"themes" text[] DEFAULT '{""}' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"user_id" varchar(255),
	CONSTRAINT "books_isbn_unique" UNIQUE("isbn")
);
--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
*/
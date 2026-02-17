import { db } from '../lib/db';
import { books, users, scholars, categories, authorsInfo, languages } from '../schema';
import { count } from 'drizzle-orm';

async function check() {
    try {
        const booksCount = await db.select({ value: count() }).from(books);
        const usersCount = await db.select({ value: count() }).from(users);
        const scholarsCount = await db.select({ value: count() }).from(scholars);
        const categoriesCount = await db.select({ value: count() }).from(categories);
        const authorsCount = await db.select({ value: count() }).from(authorsInfo);
        const languagesCount = await db.select({ value: count() }).from(languages);

        console.log({
            books: booksCount[0].value,
            users: usersCount[0].value,
            scholars: scholarsCount[0].value,
            categories: categoriesCount[0].value,
            authors: authorsCount[0].value,
            languages: languagesCount[0].value,
        });
        process.exit(0);
    } catch (err) {
        console.error('Check failed:', err);
        process.exit(1);
    }
}

check();

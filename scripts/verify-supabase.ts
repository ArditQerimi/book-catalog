import 'dotenv/config';
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function verify() {
    try {
        const booksCount = await db.execute(sql`SELECT count(*) FROM books`);
        console.log('Books in Supabase:', booksCount[0]);
        process.exit(0);
    } catch (err) {
        console.error('Verification failed:', err);
        process.exit(1);
    }
}

verify();

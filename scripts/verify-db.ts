import 'dotenv/config';
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function verify() {
    console.log('DATABASE_URL from env:', process.env.DATABASE_URL ? 'FOUND' : 'NOT FOUND');
    try {
        const dbName = await db.execute(sql`SELECT current_database()`);
        const schemaName = await db.execute(sql`SELECT current_schema()`);
        console.log('Actual Database:', dbName[0]);
        console.log('Actual Schema:', schemaName[0]);
        process.exit(0);
    } catch (err) {
        console.error('Verification failed:', err);
        process.exit(1);
    }
}

verify();

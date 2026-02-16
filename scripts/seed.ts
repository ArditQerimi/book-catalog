
import { db } from '../lib/db';
import { books, users } from '../schema';
import { MOCK_BOOKS } from '../constants';
import * as bcrypt from 'bcrypt';

async function seed() {
  console.log('Seeding database...');

  // Seed Books
  for (const book of MOCK_BOOKS) {
    await db.insert(books).values({
      ...book,
      price: book.price.toString(),
      themes: book.themes || [],
    }).onConflictDoNothing();
  }

  // Seed Admin User
  const hashedPassword = await bcrypt.hash('admin', 10);
  await db.insert(users).values({
    username: 'admin',
    password: hashedPassword,
    role: 'admin',
  }).onConflictDoNothing();

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

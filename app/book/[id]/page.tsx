
import { getBooksAction } from '@/lib/actions';
import BookDetailClient from '@/components/BookDetailClient';

export const dynamic = 'force-dynamic';

export default async function BookPage({ params }: { params: { id: string } }) {
  const books = await getBooksAction();
  const book = books.find((b) => b.id === params.id);
  
  return <BookDetailClient book={book || null} allBooks={books} />;
}

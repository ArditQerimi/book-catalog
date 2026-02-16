
import { getBooksAction } from '@/lib/actions';
import HomePageClient from '@/components/HomePageClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const books = await getBooksAction();
  return <HomePageClient books={books} />;
}

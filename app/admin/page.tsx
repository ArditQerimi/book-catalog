
import { getBooksAction } from '@/lib/actions';
import AdminPageClient from '@/components/AdminPageClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const books = await getBooksAction();
  return <AdminPageClient books={books} />;
}

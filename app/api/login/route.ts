
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { login } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  const user = await db.select().from(users).where(eq(users.username, username)).limit(1);

  if (user.length === 0) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  const isPasswordValid = await bcrypt.compare(password, user[0].password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  await login(formData);

  return NextResponse.json({ success: true });
}

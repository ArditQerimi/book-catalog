import { NextResponse, NextRequest } from 'next/server';
import { decrypt } from './lib/auth';

const COOKIE_NAME = 'nur_session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(COOKIE_NAME);

  let isAuthenticated = false;
  if (session?.value) {
    try {
      const payload = await decrypt(session.value);
      isAuthenticated = !!payload?.userId;
    } catch (err) {
      isAuthenticated = false;
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from login page
  if (pathname === '/login') {
    if (isAuthenticated) {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};

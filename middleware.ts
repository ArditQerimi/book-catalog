
import { ActivePage } from "./types";

/**
 * NEXT.JS STYLE MIDDLEWARE
 * Runs before any route navigation to handle security and redirection.
 */

const PROTECTED_ROUTES: ActivePage[] = ['admin'];
const PUBLIC_ONLY_ROUTES: ActivePage[] = ['login'];
const SESSION_COOKIE = 'nur_session';

export interface MiddlewareResponse {
  authorized: boolean;
  redirect?: ActivePage;
}

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function middleware(targetPage: ActivePage): MiddlewareResponse {
  const session = getCookie(SESSION_COOKIE);
  const isAuthenticated = session === 'authenticated_scribe';

  // 1. Protection Check
  if (PROTECTED_ROUTES.includes(targetPage)) {
    if (!isAuthenticated) {
      console.warn(`[Middleware] Unauthorized access to ${targetPage}. Redirecting to login.`);
      return { authorized: false, redirect: 'login' };
    }
  }

  // 2. Auth-User Redirect Check (Don't show login if already logged in)
  if (PUBLIC_ONLY_ROUTES.includes(targetPage)) {
    if (isAuthenticated) {
      console.log(`[Middleware] User already authenticated. Redirecting away from ${targetPage} to admin.`);
      return { authorized: false, redirect: 'admin' };
    }
  }

  // 3. Passthrough
  return { authorized: true };
}

// middleware.js (root level)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, search, protocol } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // =======================================
  // 1. WWW Redirect (www → non-www)
  // =======================================
  if (host.startsWith('www.')) {
    const newHost = host.replace('www.', '');
    const newUrl = `${protocol}//${newHost}${pathname}${search}`;
    return NextResponse.redirect(newUrl, 301);
  }

  // =======================================
  // 2. Security Headers
  // =======================================
  const response = NextResponse.next();

  // Content Security Policy (basic)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );

  // XSS Protection
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

// Áp dụng cho tất cả routes trừ:
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
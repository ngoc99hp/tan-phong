import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, search, protocol } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // Skip middleware for localhost
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');

  // =======================================
  // 1. WWW Redirect (www → non-www)
  // =======================================
  if (!isLocalhost && host.startsWith('www.')) {
    const newHost = host.replace('www.', '');
    const newUrl = `${protocol}//${newHost}${pathname}${search}`;
    return NextResponse.redirect(newUrl, 301);
  }

  // =======================================
  // 2. Force HTTPS in production
  // =======================================
  if (!isLocalhost && protocol === 'http:') {
    const newUrl = `https://${host}${pathname}${search}`;
    return NextResponse.redirect(newUrl, 301);
  }

  // =======================================
  // 3. Security Headers
  // =======================================
  const response = NextResponse.next();

  // Content Security Policy (relaxed cho development)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data: https://cdnjs.cloudflare.com; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'self';"
  );

  // XSS Protection
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // HSTS (HTTP Strict Transport Security) - chỉ production
  if (!isLocalhost) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // DNS Prefetch
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  return response;
}

// =======================================
// Matcher Configuration
// =======================================
export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - /api/* (API routes - có auth riêng)
     * - /_next/static (static files)
     * - /_next/image (image optimization)
     * - /favicon.ico
     * - Static files (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
};
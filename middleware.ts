import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_AUTH_COOKIE = 'nowis_admin_session';

const protectedPrefixes = ['/dashboard', '/content', '/appearance', '/sections', '/media', '/preview', '/api/media', '/api/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow token-protected seed endpoint without admin cookie.
  if (pathname === '/api/admin/seed') {
    return NextResponse.next();
  }

  if (!protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/content/:path*', '/appearance/:path*', '/sections/:path*', '/media/:path*', '/preview/:path*', '/api/media/:path*', '/api/admin/:path*'],
};
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Middleware for adding security headers to all requests
 * Replaces Clerk authentication middleware with basic security
 */
export function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)

  // Admin gate for /admin/* (subpaths) and /api/admin/*
  // Allow root /admin to render the login form without a session to avoid redirect loops
  const isApiAdmin = pathname.startsWith('/api/admin')
  // Always allow auth/session endpoints themselves
  if (
    pathname === '/api/admin/login' ||
    pathname === '/api/admin/logout' ||
    pathname === '/api/admin/sessions'
  ) {
    return NextResponse.next()
  }
  const isAdminSubPath = pathname.startsWith('/admin/')
  if (isApiAdmin || isAdminSubPath) {
    const adminCookie = request.cookies.get('admin_session')?.value
    const supabaseAccess = request.cookies.get('sb-access-token')?.value
    // Allow if either a valid admin_session exists OR a Supabase access token is present
    if (!adminCookie && !supabaseAccess) {
      // Redirect browser pages to /admin (login form), block API calls
      if (isApiAdmin) {
        return new NextResponse(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
      }
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // Create response and add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

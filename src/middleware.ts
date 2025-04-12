import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Don't apply middleware to auth pages or static assets
  if (
    request.nextUrl.pathname.startsWith('/signin') ||
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon.ico') ||
    request.nextUrl.pathname === '/'
  ) {
    return response;
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/profile', '/projects'];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Get the session cookie from the request
    const session = request.cookies.get('session')?.value;

    if (!session) {
      // Redirect to signin page since there's no session
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    
    // With the Edge Runtime, we can't verify the session token directly
    // We'll rely on client-side auth checks via the ProtectedRoute component
    return response;
  }

  return response;
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 
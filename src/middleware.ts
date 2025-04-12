import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  initializeApp({
    credential: cert(serviceAccount),
  });
}

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
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    try {
      // Verify the session cookie
      await getAuth().verifySessionCookie(session, true);
      
      // Session is valid, let the request continue
      return response;
    } catch (err) {
      // Session is invalid or expired, redirect to signin
      console.error('Invalid session:', err);
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // For username-based profile pages (e.g., /username)
  const usernameMatch = request.nextUrl.pathname.match(/^\/([^\/]+)$/);
  if (usernameMatch) {
    const username = usernameMatch[1];
    
    // Skip middleware processing for known static paths
    if (
      username === 'signin' || 
      username === 'signup' || 
      username === 'profile' || 
      username === 'projects'
    ) {
      return response;
    }

    try {
      // Check if username exists in Firestore
      const db = getFirestore();
      const usernameDoc = await db.collection('usernames').doc(username).get();
      
      if (!usernameDoc.exists) {
        // Username not found, redirect to 404 page or home
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Username exists, let the request continue
      return response;
    } catch (err) {
      console.error('Error checking username:', err);
      return response;
    }
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
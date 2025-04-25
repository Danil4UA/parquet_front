import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const publicPaths = [
  '/favicon.ico',
  '/api',
  '/_next',
  '/images',
  '/robots.txt',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (publicPaths.some(prefix => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  const locale = path.split('/')[1];
  const isLocale = routing.locales.includes(locale as any);
  
  if (!isLocale && !path.startsWith('/api/')) {
    const pathWithoutLeadingSlash = path.startsWith('/') ? path.slice(1) : path;
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}/${pathWithoutLeadingSlash}`, request.url));
  }

  const isProtectedRoute = path.includes('/admin') || 
                          (isLocale && path.includes(`/${locale}/admin`));
  
  if (isProtectedRoute) {
    const session = await getToken({ 
      req: request, 
      secret: process.env.NEXT_AUTH_SECRET 
    });
    
    if (!session) {
      const redirectLocale = isLocale ? locale : routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${redirectLocale}/login`, request.url));
    }
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    
    '/(en|ru|he)/:path*',
    
    '/admin/:path*',
    '/(en|ru|he)/admin/:path*',
    
    '/login',
    '/(en|ru|he)/login',
    
    '/((?!_next|api|favicon.ico|robots.txt).*)',

  ]
};
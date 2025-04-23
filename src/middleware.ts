import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const locale = path.split('/')[1];
  const isLocale = routing.locales.includes(locale as any);
  
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
    '/(en|ru|he)/:path*',
    
    '/admin/:path*',
    '/(en|ru|he)/admin/:path*',
    
    '/login',
    '/(en|ru|he)/login'
  ]
};
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request) {
  const path = request.nextUrl.pathname;
  
  const isProtectedRoute = /\/(en|ru|he)\/admin/.test(path) || path.startsWith('/admin');
  
  const token = request.cookies.get('admin-token')?.value;
  
  if (isProtectedRoute && !token) {
    let locale = 'en';
    const localeMatch = path.match(/^\/(en|ru|he)/);
    if (localeMatch) {
      locale = localeMatch[1];
    }
    
    const loginUrl = new URL(`/${locale}/login`, request.url);
    
    loginUrl.searchParams.set('returnTo', path);
    
    return NextResponse.redirect(loginUrl);
  }
  
  if (/\/(en|ru|he)\/login/.test(path) && token) {
    let locale = 'en';
    const localeMatch = path.match(/^\/(en|ru|he)/);
    if (localeMatch) {
      locale = localeMatch[1];
    }
    
    return NextResponse.redirect(new URL(`/${locale}/admin/dashboard`, request.url));
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
    '/(en|ru|he)/login'
  ]
};
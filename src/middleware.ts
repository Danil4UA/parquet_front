import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const language = path.split("/")[1] || "en";

  const isProtected = path.includes(`/${language}/admin`);
  
  if (isProtected) {
    const session = await getToken({ 
      req, 
      secret: process.env.NEXT_AUTH_SECRET 
    });

    console.log("session", session)
    
    if (!session) {
      return NextResponse.redirect(new URL(`/${language}/login`, req.url));
    }
  }
  
  return NextResponse.next();
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
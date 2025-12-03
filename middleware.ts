import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  // Add your middleware logic here
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
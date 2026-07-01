import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname.startsWith('/config') && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/forbidden', req.url));
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|login).*)',
  ],
};

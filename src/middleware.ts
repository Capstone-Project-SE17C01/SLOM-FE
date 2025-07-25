import { NextRequest, NextResponse } from 'next/server';
import constants from '@/config/constants';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|videos|locales).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;
  
  const publicPaths = ['/login', '/register', '/forgot-password', '/confirm-registeration', '/'];
  const isPublicPath = publicPaths.some(publicPath => path === publicPath || path.startsWith(publicPath + '/'));
  
  const userInfoCookie = request.cookies.get(constants.USER_INFO)?.value;
  const accessToken = request.cookies.get(constants.ACCESS_TOKEN)?.value;
  
  let userInfo = null;
  if (userInfoCookie) {
    try {
      userInfo = JSON.parse(userInfoCookie);
    } catch (error) {
      console.error('Error parsing user info:', error);
    }
  }

  const isAdminRoute = path.startsWith('/admin');
  
  const isAdmin = userInfo?.role === 'ADMIN' || userInfo?.roleName === 'ADMIN';
  
  if (isAdminRoute && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminRoute && userInfo && !isAdmin) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  if (isAdmin && !isAdminRoute && !isPublicPath) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
} 
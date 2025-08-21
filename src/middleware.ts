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
  
  // Mở rộng danh sách đường dẫn công khai
  const publicPaths = ['/login', '/register', '/forgot-password', '/confirm-registeration', '/', '/home', '/about', '/contact', '/features'];
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
  
  if (!isPublicPath && !accessToken) {
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, request.url));
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  if (isAdmin && !isAdminRoute && !isPublicPath) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
} 
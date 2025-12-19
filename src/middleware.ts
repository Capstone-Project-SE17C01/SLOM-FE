import { NextRequest, NextResponse } from 'next/server';
import constants from '@/config/constants';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|videos|locales).*)',
  ],
};

// Hardcoded credentials for testing
const HARDCODED_USER_INFO = {
  id: "49ee2498-2021-704c-25cc-bef22f73ec83",
  email: "quanpva.dev@gmail.com",
  role: "USER",
  roleName: "USER",
  username: "quanpva.dev",
  avatarUrl: "",
  preferredLanguageId: "en",
  languageCode: "en",
  courseTitle: "chooseCourse",
  vipUser: true,
};

const HARDCODED_ACCESS_TOKEN = "hardcoded-access-token-for-testing";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;
  
  const publicPaths = ['/login', '/register', '/forgot-password', '/confirm-registeration', '/', '/home', '/about', '/contact', '/features', '/result-payment'];
  const isPublicPath = publicPaths.some(publicPath => path === publicPath || path.startsWith(publicPath + '/'));
  
  let userInfoCookie = request.cookies.get(constants.USER_INFO)?.value;
  let accessToken = request.cookies.get(constants.ACCESS_TOKEN)?.value;
  
  // If no credentials exist, use hardcoded ones for testing
  if (!userInfoCookie || !accessToken) {
    userInfoCookie = JSON.stringify(HARDCODED_USER_INFO);
    accessToken = HARDCODED_ACCESS_TOKEN;
    
    // Create response to set cookies
    const response = NextResponse.next();
    response.cookies.set(constants.USER_INFO, userInfoCookie, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });
    response.cookies.set(constants.ACCESS_TOKEN, accessToken, {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });
    response.cookies.set(constants.LOCALE, HARDCODED_USER_INFO.languageCode, {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });
    
    // Continue with hardcoded credentials
    const isAdminRoute = path.startsWith('/admin');
    const isAdmin = HARDCODED_USER_INFO.role === 'ADMIN' || HARDCODED_USER_INFO.roleName === 'ADMIN';
    
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    return response;
  }
  
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
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  if (isAdmin && !isAdminRoute && !isPublicPath) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
} 
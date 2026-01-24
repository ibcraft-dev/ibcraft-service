import { NextRequest } from "next/server";
import { NextResponse } from "next/server";



export function middleware(request: NextRequest) {
  let hidden;
  const isProd = process.env.NEXT_PUBLIC_DEVMODE;
  const url = request.nextUrl;

  if (isProd === "production") {
    hidden = NextResponse.redirect(new URL('/', request.url))
    hidden.cookies.set('hidden', 'true', {path: '/'});
    return hidden;
  }
   

  hidden = NextResponse.next();
  hidden.cookies.set('hidden', 'false', {path: '/'});
  return hidden;
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
};

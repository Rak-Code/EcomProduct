import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Get the Firebase ID token from cookies
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // For now, just allow if token exists - detailed verification will happen client-side
    // This prevents the circular dependency issue with the API route
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

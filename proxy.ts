import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    if (!request.cookies.has("yo_access")) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/app/:path*", "/onboarding/organization"],
};

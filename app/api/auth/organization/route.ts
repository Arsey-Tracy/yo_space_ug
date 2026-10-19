import { NextRequest, NextResponse } from "next/server";

import {
    ACTIVE_ORGANIZATION_COOKIE,
    authenticatedBackendRequest,
    clearSessionCookies,
    isSameOrigin,
    storeSessionCookies,
} from "@/lib/server-auth";

export async function POST(request: NextRequest) {
    if (!isSameOrigin(request)) {
        return NextResponse.json({ detail: "Cross-origin request rejected." }, { status: 403 });
    }
    const body = await request.json();
    const { response: backendResponse, accessToken, refreshToken } =
        await authenticatedBackendRequest("/api/auth/organization/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

    if (!backendResponse.ok) {
        const result = NextResponse.json(await backendResponse.json(), {
            status: backendResponse.status,
        });
        if (backendResponse.status === 401) clearSessionCookies(result);
        storeSessionCookies(result, accessToken, refreshToken);
        return result;
    }

    const organization = await backendResponse.json() as { id: number | string };
    const result = NextResponse.json({ organization }, { status: backendResponse.status });
    storeSessionCookies(result, accessToken, refreshToken);
    result.cookies.set(ACTIVE_ORGANIZATION_COOKIE, String(organization.id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });
    return result;
}

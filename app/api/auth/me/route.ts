import { NextResponse } from "next/server";

import {
    ACTIVE_ORGANIZATION_COOKIE,
    authenticatedBackendRequest,
    clearSessionCookies,
    storeSessionCookies,
} from "@/lib/server-auth";

export async function GET() {
    const { response: backendResponse, accessToken, refreshToken } =
        await authenticatedBackendRequest("/api/auth/me/");

    if (!backendResponse.ok) {
        const result = NextResponse.json(
            await backendResponse.json(),
            { status: backendResponse.status },
        );
        if (backendResponse.status === 401) clearSessionCookies(result);
        return result;
    }

    const profile = await backendResponse.json() as {
        active_organization?: { id?: number | string } | null;
    };
    const result = NextResponse.json(profile);
    storeSessionCookies(result, accessToken, refreshToken);
    if (profile.active_organization?.id !== undefined) {
        result.cookies.set(ACTIVE_ORGANIZATION_COOKIE, String(profile.active_organization.id), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });
    } else {
        result.cookies.set(ACTIVE_ORGANIZATION_COOKIE, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });
    }
    return result;
}

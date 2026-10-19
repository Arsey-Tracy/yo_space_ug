import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const ACCESS_COOKIE = "yo_access";
export const REFRESH_COOKIE = "yo_refresh";
export const ACTIVE_ORGANIZATION_COOKIE = "yo_active_org";

export function backendUrl(path: string) {
    const baseUrl = (process.env.DJANGO_API_URL ?? "http://127.0.0.1:8000").replace(/\/+$/, "");
    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isSameOrigin(request: NextRequest) {
    return request.headers.get("origin") === request.nextUrl.origin;
}

export async function backendRequest(path: string, init: RequestInit = {}) {
    return fetch(backendUrl(path), {
        ...init,
        cache: "no-store",
    });
}

function setSessionCookie(response: NextResponse, name: string, value: string, maxAge: number) {
    response.cookies.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge,
    });
}

export function storeSessionCookies(
    response: NextResponse,
    accessToken?: string,
    refreshToken?: string,
) {
    if (accessToken) setSessionCookie(response, ACCESS_COOKIE, accessToken, 60 * 60 * 24 * 7);
    if (refreshToken) setSessionCookie(response, REFRESH_COOKIE, refreshToken, 60 * 60 * 24 * 30);
}

export function clearSessionCookies(response: NextResponse) {
    for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, ACTIVE_ORGANIZATION_COOKIE]) {
        response.cookies.set(name, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });
    }
}

export async function authenticatedBackendRequest(path: string, init: RequestInit = {}) {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
    let refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
    const activeOrganization = cookieStore.get(ACTIVE_ORGANIZATION_COOKIE)?.value;

    if (!accessToken) {
        return { response: new Response(null, { status: 401 }), accessToken, refreshToken };
    }

    const sendRequest = (token: string) => {
        const headers = new Headers(init.headers);
        headers.set("Authorization", `Bearer ${token}`);
        if (activeOrganization) headers.set("X-Organization-ID", activeOrganization);
        return backendRequest(path, { ...init, headers });
    };

    let response = await sendRequest(accessToken);
    if (response.status === 401 && refreshToken) {
        const refreshResponse = await backendRequest("/api/auth/token/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
            const refreshed = await refreshResponse.json() as {
                access?: string;
                refresh?: string;
            };
            accessToken = refreshed.access;
            refreshToken = refreshed.refresh ?? refreshToken;
            if (accessToken) response = await sendRequest(accessToken);
        }
    }

    return { response, accessToken, refreshToken };
}

export async function authJsonResponse(response: Response) {
    const payload = await response.json() as {
        tokens?: { access?: string; refresh?: string };
        organization?: { id?: number | string } | null;
        [key: string]: unknown;
    };

    if (response.ok && (!payload.tokens?.access || !payload.tokens?.refresh)) {
        return NextResponse.json(
            { detail: "Authentication response did not include valid tokens." },
            { status: 502 },
        );
    }

    const { tokens, organization, ...clientPayload } = payload;
    const nextResponse = NextResponse.json(clientPayload, { status: response.status });
    if (tokens?.access && tokens.refresh) {
        storeSessionCookies(nextResponse, tokens.access, tokens.refresh);
    }
    if (organization?.id !== undefined && organization?.id !== null) {
        nextResponse.cookies.set(ACTIVE_ORGANIZATION_COOKIE, String(organization.id), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });
    } else if (response.ok) {
        nextResponse.cookies.set(ACTIVE_ORGANIZATION_COOKIE, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });
    }
    return nextResponse;
}

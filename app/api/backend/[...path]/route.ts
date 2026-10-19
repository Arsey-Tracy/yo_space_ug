import { NextRequest, NextResponse } from "next/server";

import {
    authenticatedBackendRequest,
    clearSessionCookies,
    isSameOrigin,
    storeSessionCookies,
} from "@/lib/server-auth";

type RouteContext = {
    params: Promise<{ path: string[] }>;
};

async function proxy(request: NextRequest, context: RouteContext) {
    if (!["GET", "HEAD"].includes(request.method) && !isSameOrigin(request)) {
        return NextResponse.json({ detail: "Cross-origin request rejected." }, { status: 403 });
    }
    const { path } = await context.params;
    if (!path.length) {
        return NextResponse.json({ detail: "A backend API path is required." }, { status: 400 });
    }

    const endpoint = `/api/${path.join("/")}/${request.nextUrl.search}`;
    const headers = new Headers();
    const contentType = request.headers.get("content-type");
    if (contentType) headers.set("Content-Type", contentType);
    const init: RequestInit = { method: request.method, headers };
    if (!["GET", "HEAD"].includes(request.method)) init.body = await request.arrayBuffer();

    const { response: backendResponse, accessToken, refreshToken } =
        await authenticatedBackendRequest(endpoint, init);
    const responseHeaders = new Headers();
    const backendContentType = backendResponse.headers.get("content-type");
    if (backendContentType) responseHeaders.set("Content-Type", backendContentType);
    const result = new NextResponse(backendResponse.body, {
        status: backendResponse.status,
        headers: responseHeaders,
    });
    if (backendResponse.status === 401) clearSessionCookies(result);
    storeSessionCookies(result, accessToken, refreshToken);
    return result;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

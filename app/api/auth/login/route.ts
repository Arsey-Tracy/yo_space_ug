import { NextRequest } from "next/server";

import { authJsonResponse, backendRequest, isSameOrigin } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
    if (!isSameOrigin(request)) {
        return Response.json({ detail: "Cross-origin request rejected." }, { status: 403 });
    }
    const body = await request.json();
    const response = await backendRequest("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return authJsonResponse(response);
}

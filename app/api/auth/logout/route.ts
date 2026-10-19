import { NextRequest, NextResponse } from "next/server";

import { clearSessionCookies, isSameOrigin } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
    if (!isSameOrigin(request)) {
        return NextResponse.json({ detail: "Cross-origin request rejected." }, { status: 403 });
    }
    const response = NextResponse.json({ ok: true });
    clearSessionCookies(response);
    return response;
}

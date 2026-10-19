type AuthResponse = {
    user: {
        id: number;
        email: string;
        username: string;
        first_name: string;
        last_name: string;
    };
    organization: { id: number; name: string } | null;
};

async function authRequest<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(path, {
        method: body === undefined ? "GET" : "POST",
        headers: body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
        credentials: "same-origin",
    });
    const payload = await response.json();
    if (!response.ok) {
        const detail = payload.detail ?? payload.non_field_errors?.[0] ?? "Authentication request failed.";
        throw new Error(detail);
    }
    return payload as T;
}

export function register(data: {
    email: string;
    password: string;
    first_name?: string;
}) {
    return authRequest<AuthResponse>("/api/auth/register", data);
}

export function login(data: { email: string; password: string }) {
    return authRequest<AuthResponse>("/api/auth/login", data);
}

export function getUser() {
    return authRequest<{ user: AuthResponse["user"] }>("/api/auth/me");
}

export function logout() {
    return authRequest<{ ok: boolean }>("/api/auth/logout", {});
}

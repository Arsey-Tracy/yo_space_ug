export type APIOptions = RequestInit;

async function request<T>(path: string, options: APIOptions = {}): Promise<T> {
    const normalizedPath = path.replace(/^\/+/, "");
    const headers = new Headers(options.headers);
    if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`/api/backend/${normalizedPath}`, {
        ...options,
        headers,
        credentials: "same-origin",
    });
    const payload = response.status === 204 ? undefined : await response.json();
    if (!response.ok) {
        const detail = payload?.detail ?? `API request failed (${response.status}).`;
        throw new Error(detail);
    }
    return payload as T;
}

export function get<T>(path: string, options?: APIOptions) {
    return request<T>(path, { ...options, method: "GET" });
}

export function post<T>(path: string, body?: unknown, options?: APIOptions) {
    return request<T>(path, {
        ...options,
        method: "POST",
        body: body === undefined ? undefined : JSON.stringify(body),
    });
}

export function put<T>(path: string, body?: unknown, options?: APIOptions) {
    return request<T>(path, {
        ...options,
        method: "PUT",
        body: body === undefined ? undefined : JSON.stringify(body),
    });
}

export function patch<T>(path: string, body?: unknown, options?: APIOptions) {
    return request<T>(path, {
        ...options,
        method: "PATCH",
        body: body === undefined ? undefined : JSON.stringify(body),
    });
}

export function del<T>(path: string, options?: APIOptions) {
    return request<T>(path, { ...options, method: "DELETE" });
}

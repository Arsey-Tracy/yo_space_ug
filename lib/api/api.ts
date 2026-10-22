export type APIOptions = RequestInit;

function formatError(value: unknown): string | undefined {
    if (typeof value === "string" && value.trim()) return value;
    if (Array.isArray(value)) {
        return value.map(formatError).filter(Boolean).join(" ");
    }
    if (value && typeof value === "object") {
        return Object.entries(value)
            .map(([key, entry]) => {
                const message = formatError(entry);
                return message ? `${key}: ${message}` : undefined;
            })
            .filter(Boolean)
            .join(" ");
    }
    return undefined;
}

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
    const responseText = response.status === 204 ? "" : await response.text();
    let payload: unknown;
    if (responseText) {
        try {
            payload = JSON.parse(responseText);
        } catch {
            payload = responseText;
        }
    }
    if (!response.ok) {
        const detail =
            formatError(
                payload && typeof payload === "object" && "detail" in payload
                    ? payload.detail
                    : payload,
            ) || `API request failed (${response.status}).`;
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

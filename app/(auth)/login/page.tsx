"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        const formData = new FormData(event.currentTarget);
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.get("email"),
                    password: formData.get("password"),
                }),
            });
            const payload = await response.json();
            if (!response.ok) {
                setError(payload.detail ?? payload.non_field_errors?.[0] ?? "Unable to sign in.");
                return;
            }
            router.push(payload.organization ? "/app" : "/onboarding/organization");
            router.refresh();
        } catch {
            setError("Could not connect to the authentication service. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-page-bg px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/" className="text-2xl font-bold tracking-tight">
                        YoSpaces
                    </Link>
                    <h1 className="mt-4 text-xl font-semibold">Welcome back</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Sign in to your organization space.
                    </p>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
                        >
                            {submitting ? "Signing in..." : "Sign in"}
                        </button>
                        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                    </form>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Don not have an account?{" "}
                        <Link href="/register" className="font-medium text-primary hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
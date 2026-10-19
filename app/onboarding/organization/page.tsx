"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrganizationOnboardingPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        const formData = new FormData(event.currentTarget);
        try {
            const response = await fetch("/api/auth/organization", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.get("organization"),
                }),
            });
            const payload = await response.json();
            if (!response.ok) {
                setError(payload.name?.[0] ?? payload.detail ?? "Unable to create your organization.");
                return;
            }
            router.replace("/app");
            router.refresh();
        } catch {
            setError("Could not connect to the authentication service. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-page-bg px-4 py-12">
            <div className="w-full max-w-lg">
                <div className="mb-8">
                    <Link href="/" className="text-2xl font-bold tracking-tight">YoSpaces</Link>
                    <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        Step 2 of 2
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold">Set up your organization</h1>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Add your organization to finish setup and open your workspace.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-card p-6 shadow-sm">
                    <div>
                        <label htmlFor="organization" className="block text-sm font-medium">
                            Organization name
                        </label>
                        <input
                            id="organization"
                            name="organization"
                            type="text"
                            autoComplete="organization"
                            required
                            maxLength={255}
                            className="mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? "Creating organization..." : "Create organization"}
                    </button>
                    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                </form>
            </div>
        </main>
    );
}

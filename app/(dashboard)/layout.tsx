import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ACCESS_COOKIE, ACTIVE_ORGANIZATION_COOKIE, backendRequest } from "@/lib/server-auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "YoSpaces",
    description: "Your Organization Dashboard.",
};

type ProfileResponse = {
    organizations: Array<{ id: number | string; name: string; role: string }>;
    active_organization?: { id: number | string; name: string; role: string } | null;
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
    if (!accessToken) redirect("/login");

    const headers = new Headers({ Authorization: `Bearer ${accessToken}` });
    const activeOrganization = cookieStore.get(ACTIVE_ORGANIZATION_COOKIE)?.value;
    if (activeOrganization) headers.set("X-Organization-ID", activeOrganization);

    const response = await backendRequest("/api/auth/me/", { headers });
    if (response.status === 401) redirect("/login");
    if (!response.ok) {
        throw new Error(`Unable to validate the signed-in user (HTTP ${response.status}).`);
    }
    const profile = await response.json() as ProfileResponse;
    if (!profile.organizations?.length) redirect("/onboarding/organization");

    return (
        <DashboardShell>{children}</DashboardShell>
    );
}
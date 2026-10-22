import { Code2 } from "lucide-react";

import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";

export default function DevelopersPage() {
    return (
        <DashboardPlaceholder
            title="Developer platform"
            description="Build integrations with YoSpaces APIs and manage your developer tools."
            icon={Code2}
            availableHref="/app/settings"
            availableLabel="Open settings"
        />
    );
}

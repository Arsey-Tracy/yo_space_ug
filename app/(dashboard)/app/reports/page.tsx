import { Activity } from "lucide-react";

import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";

export default function ReportsPage() {
    return (
        <DashboardPlaceholder
            title="Reports"
            description="Review and export communication and organization reports."
            icon={Activity}
            availableHref="/app/analytics"
            availableLabel="Go to analytics"
        />
    );
}

import { ChartNoAxesColumn } from "lucide-react";

import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";

export default function AnalyticsPage() {
    return (
        <DashboardPlaceholder
            title="Analytics"
            description="Track message delivery, engagement, and communication trends across your organization."
            icon={ChartNoAxesColumn}
            availableHref="/app/sms"
            availableLabel="Go to SMS"
        />
    );
}

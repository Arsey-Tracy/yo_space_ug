import { Clock3 } from "lucide-react";

import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";

export default function SchedulePage() {
    return (
        <DashboardPlaceholder
            title="Schedule"
            description="See and manage communications planned for future delivery."
            icon={Clock3}
            availableHref="/app/sms"
            availableLabel="Schedule an SMS"
        />
    );
}

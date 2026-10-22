import { Workflow } from "lucide-react";

import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";

export default function WorkflowPage() {
    return (
        <DashboardPlaceholder
            title="Workflows"
            description="Automate recurring communication tasks and organization workflows."
            icon={Workflow}
            availableHref="/app/spaces"
            availableLabel="Manage Spaces"
        />
    );
}

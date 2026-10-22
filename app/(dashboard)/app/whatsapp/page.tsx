import { MessageCirclePlus } from "lucide-react";

import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";

export default function WhatsAppPage() {
    return (
        <DashboardPlaceholder
            title="WhatsApp"
            description="Manage WhatsApp conversations and send updates to your audience."
            icon={MessageCirclePlus}
            availableHref="/app/sms"
            availableLabel="Send an SMS instead"
        />
    );
}

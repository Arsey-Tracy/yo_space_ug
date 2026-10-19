import { Check, Users, Globe2, MessageSquare, Shield, Zap, BarChart3, Smartphone } from "lucide-react";

const features = [
    {
        icon: <Users className="size-6" />,
        title: "Community Management",
        description: "Bring your members together in one organized space with roles, permissions, and custom channels.",
    },
    {
        icon: <Globe2 className="size-6" />,
        title: "Multi-Channel Reach",
        description: "Connect through web, mobile, and messaging platforms to reach people where they are.",
    },
    {
        icon: <MessageSquare className="size-6" />,
        title: "Real-Time Messaging",
        description: "Keep conversations flowing with threaded messages, reactions, and instant notifications.",
    },
    {
        icon: <Shield className="size-6" />,
        title: "Secure & Private",
        description: "Enterprise-grade security with SSO, audit logs, and granular privacy controls.",
    },
    {
        icon: <Zap className="size-6" />,
        title: "Fast Setup",
        description: "Get your organization online in minutes with templates, invites, and onboarding flows.",
    },
    {
        icon: <BarChart3 className="size-6" />,
        title: "Analytics & Insights",
        description: "Understand engagement with dashboards that track members, activity, and growth.",
    },
    {
        icon: <Smartphone className="size-6" />,
        title: "Mobile First",
        description: "A native-quality experience on every device, with offline support and push alerts.",
    },
    {
        icon: <Check className="size-6" />,
        title: "Custom Branding",
        description: "Make it yours with logos, colors, domains, and a look that matches your organization.",
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything your organization needs
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        A complete toolkit for building, managing, and growing connected communities.
                    </p>
                </div>
                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group rounded-xl border bg-card p-6 transition-all hover:shadow-md"
                        >
                            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-icon-bg text-primary">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold">{feature.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
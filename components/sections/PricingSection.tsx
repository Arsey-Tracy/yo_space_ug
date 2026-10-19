import { Check } from "lucide-react";

const plans = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for small teams getting started.",
        features: [
            "Up to 50 members",
            "5 active spaces",
            "Basic analytics",
            "Community support",
        ],
        highlighted: false,
    },
    {
        name: "Growth",
        price: "$29",
        description: "For growing organizations that need more control.",
        features: [
            "Up to 500 members",
            "Unlimited spaces",
            "Advanced analytics",
            "Priority support",
            "Custom branding",
            "SSO integration",
        ],
        highlighted: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations with complex needs.",
        features: [
            "Unlimited members",
            "Unlimited spaces",
            "Full API access",
            "Dedicated manager",
            "On-premise deployment",
            "Advanced security",
            "SLA guarantee",
        ],
        highlighted: false,
    },
];

export function PricingSection() {
    return (
        <section id="pricing" className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Simple, transparent pricing
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Choose a plan that fits your organization. Upgrade or downgrade anytime.
                    </p>
                </div>
                <div className="mt-16 grid gap-6 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative flex flex-col rounded-xl border p-6 ${
                                plan.highlighted
                                    ? "bg-card shadow-lg ring-2 ring-primary"
                                    : "bg-card"
                            }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                                        Most popular
                                    </span>
                                </div>
                            )}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">{plan.name}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {plan.description}
                                </p>
                            </div>
                            <div className="mb-6 flex items-baseline">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                {plan.price !== "Custom" && (
                                    <span className="ml-1 text-muted-foreground">/month</span>
                                )}
                            </div>
                            <ul className="mb-6 space-y-3">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                        <Check className="size-4 shrink-0 text-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-auto">
                                <a
                                    href="/register"
                                    className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                        plan.highlighted
                                            ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90"
                                            : "border bg-background hover:bg-muted"
                                    }`}
                                >
                                    Get started
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
import { Check } from "lucide-react";

const steps = [
    {
        step: "01",
        title: "Create your space",
        description: "Set up your organization in minutes with our guided onboarding. Add your logo, choose a domain, and invite your first members.",
    },
    {
        step: "02",
        title: "Organize your community",
        description: "Create channels, assign roles, and set permissions so the right people have access to the right information.",
    },
    {
        step: "03",
        title: "Start connecting",
        description: "Send announcements, start conversations, and build relationships that keep your community engaged.",
    },
    {
        step: "04",
        title: "Grow together",
        description: "Use analytics to understand engagement, onboard new members smoothly, and scale your organization with confidence.",
    },
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        How YoSpaces works
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        From setup to scale, a simple path to a connected organization.
                    </p>
                </div>
                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-hero-ui text-sm font-bold text-primary">
                                {step.step}
                            </div>
                            <h3 className="text-lg font-semibold">{step.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
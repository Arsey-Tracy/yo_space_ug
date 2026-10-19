import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
    return (
        <section className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-2xl border bg-card p-8 sm:p-12 lg:p-16">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Ready to connect your organization?
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Join forward-thinking organizations building a single connected space for their communities.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-all hover:gap-3 hover:opacity-90"
                            >
                                Get Started <ArrowRight className="size-4" />
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="inline-flex items-center justify-center rounded-lg border bg-background px-6 py-3 font-medium transition-colors hover:bg-muted"
                            >
                                See how it works
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
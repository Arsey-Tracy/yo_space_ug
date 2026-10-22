import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type DashboardPlaceholderProps = {
    title: string;
    description: string;
    icon: LucideIcon;
    eyebrow?: string;
    availableHref?: string;
    availableLabel?: string;
};

export function DashboardPlaceholder({
    title,
    description,
    icon: Icon,
    eyebrow = "Coming soon",
    availableHref = "/app",
    availableLabel = "Back to dashboard",
}: DashboardPlaceholderProps) {
    return (
        <div className="space-y-6">
            <header>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
                    {eyebrow}
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    {title}
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-slate-600">{description}</p>
            </header>

            <section className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <Icon className="size-7" />
                </span>
                <h2 className="mt-5 text-lg font-semibold text-slate-950">
                    We’re working on this page
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    This dashboard area is not available yet. You can still use the active tools while we build it.
                </p>
                <Link
                    href={availableHref}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
                >
                    {availableLabel}
                    <ArrowRight className="size-4" />
                </Link>
            </section>
        </div>
    );
}

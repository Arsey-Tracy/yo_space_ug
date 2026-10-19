import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import {
    ArrowUpRight,
    CalendarIcon,
    CalendarRange,
    MessageSquare,
    Phone,
    Plus,
    Wallet,
} from "lucide-react";

const metrics = [
    { label: "SMS sent", value: "_", note: "Total messages sent", icon: MessageSquare },
    { label: "Voice calls", value: "_", note: "Total calls", icon: Phone },
    { label: "Scheduled messages", value: "_", note: "Upcoming messages", icon: CalendarIcon },
    { label: "Wallet balance", value: "_", note: "Available", icon: Wallet },
];

const quickActions = [
    { label: "Send SMS", href: "/app/sms" },
    { label: "Send bulk SMS", href: "/app/sms" },
    { label: "Schedule message", href: "/app/sms" },
    { label: "Manage Spaces", href: "/app/spaces" },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <DashboardPageHeader
                eyebrow="OVERVIEW"
                title="Dashboard"
                description="Manage your communications and organization from one place."
                actions={
                    <>
                        <Button variant="outline" className="bg-white">
                            <CalendarRange className="mr-2 size-4" />
                            Data range
                        </Button>
                        <Link
                            href="/app/sms"
                            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-2.5 text-sm font-medium text-white transition hover:bg-orange-700"
                        >
                            <Plus className="size-4" />
                            New message
                        </Link>
                    </>
                }
            />

            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
                {metrics.map((metric) => {
                    const Icon = metric.icon;

                    return (
                        <div
                            key={metric.label}
                            className="rounded-xl border border-slate-200/80 bg-white p-5"
                        >
                            <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                                <span className="flex size-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                                    <Icon className="size-[18px]" />
                                </span>
                            </div>
                            <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                                {metric.value}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">{metric.note}</p>
                        </div>
                    );
                })}
            </section>
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <div className="min-h-72 rounded-xl border border-slate-200/80 bg-white p-5 xl:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">
                                Communication activity
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Message and call activity over time
                            </p>
                        </div>
                        <Button variant="ghost" size="sm">
                            View analytics
                            <ArrowUpRight className="ml-1 size-4" />
                        </Button>
                    </div>
                    <div className="mt-6 flex min-h-44 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60">
                        <p className="text-sm text-slate-400">Activity chart goes here</p>
                    </div>
                </div>
                <div className="min-h-72 rounded-xl border border-slate-200/80 bg-white p-5">
                    <h2 className="text-sm font-semibold text-slate-900">Quick Actions</h2>
                    <div className="mt-5 space-y-4">
                        {quickActions.map((action, index) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                                    index === 0
                                        ? "border-orange-600 bg-orange-600 text-white hover:bg-orange-700"
                                        : "border-slate-200 text-slate-700 hover:border-orange-200 hover:bg-orange-50"
                                }`}
                            >
                                {action.label}
                                <ArrowUpRight className="size-4" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div className="min-h-64 rounded-xl border border-slate-200/80 bg-white p-5">
                    <h2 className="text-sm font-semibold text-slate-900">
                        Recent communications
                    </h2>
                    <p className="mt-2 text-sm text-slate-900">
                        Recent messages, delivery statuses and calls will appear here.
                    </p>
                </div>
                <div className="min-h-64 rounded-xl border border-slate-200/80 bg-white p-5">
                    <h2 className="text-sm font-semibold text-slate-900">Your Spaces</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Organization groups and their communication activity will appear here.
                    </p>
                </div>
            </section>
        </div>
    );
}
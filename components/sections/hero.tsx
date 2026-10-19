import { ArrowRight, Globe2, MessageSquare, Users } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-150 bg-[theme(colors.primary/10)]" />
            <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 pb-24 pt-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-32 lg:pt-28">
                <div className="max-w-2xl">
                    <div className="mb-6 inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-sm text-muted-foreground shadow-sm backdrop-blur">
                        <span className="mr-2 h-2 w-2 rounded-full bg-primary" />
                        Built for connected organizations
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        Your Organization
                        <span className="block text-primary">One Connected Space</span>
                    </h1>
                    <p className="mt-4 text-muted-foreground">
                        Bring your community together in one simple digital space.
                    </p>
                    <p className="mt-2 text-muted-foreground">
                        YoSpaces helps organizations connect with their members, manage their communities, and reach people through the channels that work for them.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-all hover:gap-3 hover:opacity-90">
                            Get Started <ArrowRight className="size-4" />
                        </Link>
                        <Link href="#how-it-works" className="inline-flex items-center justify-center rounded-lg border bg-background px-6 py-3 font-medium transition-colors hover:bg-muted">
                            See how it works
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground">
                        Built for organizations, communities, teams, and groups.
                    </p>
                </div>
                <div className="relative">
                    <div className="rounded-2xl border bg-card p-3 shadow-2xl">
                        <div className="overflow-hidden rounded-xl border bg-background">
                            <div className="flex h-10 items-center gap-2 border-b px-4">
                                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                                <div className="ml-4 h-5 flex-1 rounded-md bg-muted" />
                            </div>
                            <div className="grid sm:grid-cols-[200px_1fr]">
                                <aside className="hidden border-r bg-muted/30 p-4 sm:block">
                                    <div className="mb-8 text-sm font-semibold">Yo Spaces</div>
                                    <div className="space-y-2 text-xs text-muted-foreground">
                                        <div className="rounded-md bg-primary/10 px-3 py-2 font-medium text-primary">Overview</div>
                                        <div className="px-3 py-2">Spaces</div>
                                        <div className="px-3 py-2">Members</div>
                                        <div className="px-3 py-2">Messages</div>
                                        <div className="px-3 py-2">Settings</div>
                                    </div>
                                </aside>
                                <div className="p-5 sm:p-7">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Welcome back</p>
                                            <h2 className="mt-1 text-lg font-semibold">IGG Worker Bees</h2>
                                        </div>
                                    </div>
                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                        <PreviewCard icon={<Users className="size-4" />} label="Members" value="124" />
                                        <PreviewCard icon={<Globe2 className="size-4" />} label="Spaces" value="12" />
                                    </div>
                                    <div className="mt-4 rounded-xl border p-4">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="size-4 text-primary" />
                                            <span className="text-sm font-medium">Recent</span>
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            <div className="h-2 w-1/2 rounded bg-muted" />
                                            <div className="h-2 w-2/3 rounded bg-muted" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div aria-hidden="true" className="absolute -bottom-10 -right-10 -z-10 size-48 rounded-full bg-primary/10 blur-3xl" />
                </div>
            </div>
        </section>
    );
}

function PreviewCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                {icon}
                <span className="text-xs">{label}</span>
            </div>
            <p className="mt-2 text-xl font-semibold">{value}</p>
        </div>
    );
}
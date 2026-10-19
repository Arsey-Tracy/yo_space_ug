import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <section className="py-20 sm:py-28">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About YoSpaces</h1>
                            <p className="mt-4 text-muted-foreground">
                                We believe every organization deserves a single connected space to bring its community together.
                            </p>
                        </div>
                        <div className="mt-16 grid gap-8 lg:grid-cols-3">
                            <div className="rounded-xl border bg-card p-8">
                                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-icon-bg text-primary">
                                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold">Our Mission</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    To make it effortless for organizations to build, manage, and grow connected communities in one unified space.
                                </p>
                            </div>
                            <div className="rounded-xl border bg-card p-8">
                                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-icon-bg text-primary">
                                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold">Our Community</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Thousands of organizations trust YoSpaces to connect their members, teams, and stakeholders every day.
                                </p>
                            </div>
                            <div className="rounded-xl border bg-card p-8">
                                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-icon-bg text-primary">
                                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold">Our Promise</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    We ship fast, stay secure, and always put your community experience first.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
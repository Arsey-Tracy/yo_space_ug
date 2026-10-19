import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export default function ContactPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b bg-card">
                <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="text-xl font-bold tracking-tight">
                        YoSpaces
                    </Link>
                    <nav className="ml-8 hidden items-center gap-6 md:flex">
                        <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</Link>
                        <Link href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How it works</Link>
                        <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1">
                <section className="py-20 sm:py-28">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Get in touch</h1>
                            <p className="mt-4 text-muted-foreground">
                                Have a question or need help? We would love to hear from you.
                            </p>
                        </div>
                        <div className="mt-12 grid gap-8 lg:grid-cols-2">
                            <div>
                                <h2 className="text-lg font-semibold">Send us a message</h2>
                                <form className="mt-4 space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium">Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium">Message</label>
                                        <textarea
                                            id="message"
                                            rows={4}
                                            className="mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
                                    >
                                        Send message
                                    </button>
                                </form>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Contact information</h2>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <p className="text-sm font-medium">Email</p>
                                        <p className="text-sm text-muted-foreground">hello@yospaces.com</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Address</p>
                                        <p className="text-sm text-muted-foreground">123 Community Street, Tech City</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
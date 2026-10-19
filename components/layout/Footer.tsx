import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-card">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <Link href="/" className="text-xl font-bold tracking-tight">
                            YoSpaces
                        </Link>
                        <p className="mt-2 text-sm text-muted-foreground">
                            One connected space for your organization.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Product</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    How it works
                                </Link>
                            </li>
                            <li>
                                <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Company</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    Developers
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    Terms
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    Security
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8">
                    <p className="text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} YoSpaces. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
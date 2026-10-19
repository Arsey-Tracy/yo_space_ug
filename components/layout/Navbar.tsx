import Link from "next/link";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="text-xl font-bold tracking-tight" aria-label="YoSpaces home">YoSpaces</Link>
                <nav className="hidden items-center gap-8 md:flex">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Platform</Link>
                    <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</Link>
                    <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How it works</Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
                    <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">About</Link>
                    <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Developers</Link>
                </nav>
                <div className="flex items-center gap-3">
                    <Link href="/login" className="hidden text-sm font-medium transition-colors hover:text-primary sm:block">
                        Sign In
                    </Link>
                    <Link href="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90">
                        Start Building
                    </Link>
                </div>
            </div>
        </header>
    );
}
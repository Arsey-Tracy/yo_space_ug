import { Check, MessageSquareText, Wallet } from "lucide-react";
import Link from "next/link";

const includedFeatures = [
    "No monthly platform subscription",
    "Top up only when you need SMS",
    "No default or free SMS credits",
    "Review wallet activity and purchases",
];

export function PricingSection() {
    return (
        <section id="pricing" className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                        Straightforward billing
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        Pay as you go
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Start without a monthly platform fee. Add SMS credits to your wallet
                        when you are ready to send.
                    </p>
                </div>

                <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="flex flex-col rounded-2xl border bg-card p-7 shadow-sm sm:p-8">
                        <div className="flex items-start gap-4">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Wallet className="size-6" />
                            </span>
                            <div>
                                <h3 className="text-xl font-semibold">Prepaid SMS wallet</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Buy credits in UGX and use them for your messages.
                                </p>
                            </div>
                        </div>

                        <div className="my-7 rounded-xl bg-muted/60 p-5">
                            <p className="text-sm font-medium text-muted-foreground">
                                Custom wallet top-up
                            </p>
                            <p className="mt-1 text-3xl font-bold tracking-tight">From UGX 500</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Available bundles and their UGX prices are shown in your wallet.
                            </p>
                        </div>

                        <ul className="mb-7 space-y-3">
                            {includedFeatures.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm">
                                    <Check className="size-4 shrink-0 text-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/register"
                            className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            <MessageSquareText className="size-4" />
                            Get started
                        </Link>
                    </div>

                    <aside className="flex flex-col justify-center rounded-2xl border bg-background p-7 sm:p-8">
                        <h3 className="text-lg font-semibold">Clear before you pay</h3>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Payments are made in Ugandan shillings. Choose a listed bundle
                            or enter a custom top-up amount in your wallet, then approve
                            the mobile-money request on your phone.
                        </p>
                        <div className="mt-6 border-t pt-5">
                            <p className="text-sm font-medium">No surprise starting balance</p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                New accounts start with zero SMS credits. Credits are added
                                to your wallet after a top-up payment is confirmed.
                            </p>
                        </div>
                        <Link
                            href="/#features"
                            className="mt-6 text-sm font-semibold text-primary hover:underline"
                        >
                            Explore platform features
                        </Link>
                    </aside>
                </div>

                <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-muted-foreground">
                    SMS credit requirements depend on the recipients in your send. Check
                    the wallet for current bundles and top-up options before purchasing.
                </p>
            </div>
        </section>
    );
}

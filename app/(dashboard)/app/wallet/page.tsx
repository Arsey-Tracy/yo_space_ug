"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowDownLeft, ArrowUpRight, CircleDollarSign, Clock3, Wallet as WalletIcon } from "lucide-react";

import { get, post } from "@/lib/api/api";

type WalletBalance = {
    organization: string;
    sms_balance: number;
    cash_balance_ugx: number;
    updated_at: string;
};

type Bundle = {
    id: number;
    name: string;
    sms_count: number;
    price: string;
    price_per_sms: string;
};

type WalletTransaction = {
    id: number;
    transaction_type: "topup" | "deduction";
    amount_paid_ugx: number;
    credits_added: number;
    payment_method: string;
    payment_reference: string;
    created_at: string;
    notes: string;
};

type PaymentStatus = "initiated" | "processing" | "completed" | "failed" | "cancelled";

type PaymentResponse = {
    reference: string;
    transaction_uuid?: string;
};

type PaymentStatusResponse = {
    status: PaymentStatus;
    wallet_balance: number;
};

type ApiList<T> = { results: T[] };

function listResults<T>(response: ApiList<T> | T[]): T[] {
    return Array.isArray(response) ? response : response.results;
}

function formatUGX(amount: number | string): string {
    return `UGX ${Number(amount).toLocaleString()}`;
}

export default function WalletPage() {
    const [balance, setBalance] = useState<WalletBalance | null>(null);
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [amount, setAmount] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedBundle, setSelectedBundle] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [paymentReference, setPaymentReference] = useState("");
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
    const [notice, setNotice] = useState("");

    const loadWallet = useCallback(async () => {
        const [walletResponse, bundleResponse, transactionResponse] = await Promise.all([
            get<WalletBalance>("billing/current/"),
            get<Bundle[]>("billing/sms-bundles/"),
            get<ApiList<WalletTransaction> | WalletTransaction[]>(
                "billing/wallet/transactions/",
            ),
        ]);
        setBalance(walletResponse);
        setBundles(bundleResponse);
        setTransactions(listResults(transactionResponse));
    }, []);

    useEffect(() => {
        let active = true;
        async function loadPage() {
            try {
                await loadWallet();
            } catch (loadError) {
                if (active) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : "Unable to load wallet details.",
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        }
        void loadPage();
        return () => {
            active = false;
        };
    }, [loadWallet]);

    useEffect(() => {
        if (!paymentReference || !["initiated", "processing"].includes(paymentStatus)) {
            return;
        }

        let active = true;
        let timeout: ReturnType<typeof setTimeout>;
        async function checkStatus() {
            try {
                const result = await get<PaymentStatusResponse>(
                    `billing/marzpay/status/${encodeURIComponent(paymentReference)}/`,
                );
                if (!active) return;
                setPaymentStatus(result.status);
                if (result.status === "completed") {
                    setNotice("Payment received. Your SMS credits are now in your wallet.");
                    await loadWallet();
                } else if (result.status === "failed" || result.status === "cancelled") {
                    setError("The mobile money payment was not completed. You can try again.");
                } else {
                    timeout = setTimeout(checkStatus, 5000);
                }
            } catch (statusError) {
                if (!active) return;
                setError(
                    statusError instanceof Error
                        ? `Payment status could not be checked: ${statusError.message}`
                        : "Payment status could not be checked.",
                );
                timeout = setTimeout(checkStatus, 10000);
            }
        }

        timeout = setTimeout(checkStatus, 3000);
        return () => {
            active = false;
            clearTimeout(timeout);
        };
    }, [loadWallet, paymentReference, paymentStatus]);

    async function handleTopUp(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setNotice("");
        setSubmitting(true);
        try {
            const payload = {
                phone_number: phoneNumber.trim(),
                ...(selectedBundle
                    ? { bundle_id: Number(selectedBundle) }
                    : { amount: Number(amount) }),
            };
            const payment = await post<PaymentResponse>(
                "billing/marzpay/initiate/",
                payload,
            );
            setPaymentReference(payment.reference);
            setPaymentStatus("processing");
            setNotice(
                "Approve the mobile money prompt on your phone. Your wallet will update after payment is confirmed.",
            );
            setAmount("");
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Unable to start the top-up.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <header>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
                    Billing
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    Wallet
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Top up SMS credits and review wallet activity. New wallets start with no credits.
                </p>
            </header>

            {error && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </p>
            )}
            {notice && (
                <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    {notice}
                    {paymentStatus && paymentStatus !== "completed" && (
                        <span className="ml-1 capitalize">Payment {paymentStatus}.</span>
                    )}
                </p>
            )}

            <section className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">SMS credits available</p>
                        <WalletIcon className="size-5 text-orange-600" />
                    </div>
                    <p className="mt-4 text-3xl font-semibold text-slate-950">
                        {loading ? "…" : (balance?.sms_balance ?? 0).toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        {balance?.organization ?? "SMS credits are deducted per recipient."}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">Cash balance</p>
                        <CircleDollarSign className="size-5 text-orange-600" />
                    </div>
                    <p className="mt-4 text-3xl font-semibold text-slate-950">
                        {loading ? "…" : formatUGX(balance?.cash_balance_ugx ?? 0)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Available wallet cash</p>
                </div>
            </section>

            <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                <form
                    onSubmit={handleTopUp}
                    className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
                >
                    <div>
                        <h2 className="text-base font-semibold text-slate-950">Top up wallet</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Pay with mobile money. Credits are added only after the payment completes.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="wallet-bundle" className="mb-2 block text-sm font-medium text-slate-800">
                            SMS bundle
                        </label>
                        <select
                            id="wallet-bundle"
                            value={selectedBundle}
                            onChange={(event) => setSelectedBundle(event.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        >
                            <option value="">Custom amount</option>
                            {bundles.map((bundle) => (
                                <option key={bundle.id} value={bundle.id}>
                                    {bundle.name} · {bundle.sms_count.toLocaleString()} SMS · {formatUGX(bundle.price)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {!selectedBundle && (
                        <div>
                            <label htmlFor="wallet-amount" className="mb-2 block text-sm font-medium text-slate-800">
                                Custom amount (minimum UGX 500)
                            </label>
                            <input
                                id="wallet-amount"
                                type="number"
                                min="500"
                                step="1"
                                required
                                value={amount}
                                onChange={(event) => setAmount(event.target.value)}
                                placeholder="5000"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="wallet-phone" className="mb-2 block text-sm font-medium text-slate-800">
                            Mobile money number
                        </label>
                        <input
                            id="wallet-phone"
                            type="tel"
                            required
                            maxLength={20}
                            value={phoneNumber}
                            onChange={(event) => setPhoneNumber(event.target.value)}
                            placeholder="07XXXXXXXX"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || loading || Boolean(paymentStatus && ["initiated", "processing"].includes(paymentStatus))}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ArrowDownLeft className="size-4" />
                        {submitting ? "Starting payment…" : "Continue to mobile money"}
                    </button>
                </form>

                <section className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-base font-semibold text-slate-950">Wallet activity</h2>
                            <p className="mt-1 text-sm text-slate-500">Top-ups and SMS usage</p>
                        </div>
                        <Clock3 className="size-5 text-slate-400" />
                    </div>
                    {loading ? (
                        <p className="text-sm text-slate-500">Loading wallet activity…</p>
                    ) : transactions.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                            No wallet activity yet.
                        </p>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {transactions.map((transaction) => (
                                <li key={transaction.id} className="flex items-center justify-between gap-4 py-4 first:pt-0">
                                    <div className="flex min-w-0 items-start gap-3">
                                        {transaction.credits_added > 0 ? (
                                            <ArrowDownLeft className="mt-0.5 size-4 shrink-0 text-green-600" />
                                        ) : (
                                            <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-slate-500" />
                                        )}
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-900">
                                                {transaction.notes || (transaction.credits_added > 0 ? "Wallet top-up" : "SMS sent")}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {new Date(transaction.created_at).toLocaleString()}
                                                {transaction.payment_method ? ` · ${transaction.payment_method}` : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className={`text-sm font-semibold ${transaction.credits_added > 0 ? "text-green-700" : "text-slate-900"}`}>
                                            {transaction.credits_added > 0 ? "+" : ""}
                                            {transaction.credits_added.toLocaleString()} SMS
                                        </p>
                                        {transaction.amount_paid_ugx > 0 && (
                                            <p className="mt-1 text-xs text-slate-500">
                                                {formatUGX(transaction.amount_paid_ugx)}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </section>
        </div>
    );
}

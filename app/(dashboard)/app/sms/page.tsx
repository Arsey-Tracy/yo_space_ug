 "use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { CalendarClock, MessageSquare, Send } from "lucide-react";

import { get, post } from "@/lib/api/api";

type Space = {
    id: number;
    name: string;
    members_count?: number;
};

type Broadcast = {
    id: number;
    space_name: string;
    message: string;
    status: "draft" | "scheduled" | "sending" | "sent" | "failed";
    scheduled_at: string | null;
    sent_at: string | null;
    recipients_count: number;
    failure_reason: string;
    created_at: string;
};

type ApiList<T> = { results: T[] };

function listResults<T>(response: ApiList<T> | T[]): T[] {
    return Array.isArray(response) ? response : response.results;
}

function localDateTimeValue(date: Date): string {
    const timezoneOffset = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export default function SmsPage() {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
    const [spaceId, setSpaceId] = useState("");
    const [message, setMessage] = useState("");
    const [deliveryMode, setDeliveryMode] = useState<"now" | "scheduled">("now");
    const [scheduledAt, setScheduledAt] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        let active = true;

        async function loadPage() {
            try {
                const [spaceResponse, broadcastResponse] = await Promise.all([
                    get<ApiList<Space> | Space[]>("spaces/"),
                    get<ApiList<Broadcast> | Broadcast[]>("sms/broadcasts/"),
                ]);
                if (!active) return;

                const availableSpaces = listResults(spaceResponse);
                setSpaces(availableSpaces);
                setSpaceId(availableSpaces[0] ? String(availableSpaces[0].id) : "");
                setBroadcasts(listResults(broadcastResponse));
            } catch (loadError) {
                if (active) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : "Unable to load SMS data.",
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
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setNotice("");

        if (!spaceId) {
            setError("Create a Space before sending a broadcast.");
            return;
        }
        if (!message.trim()) {
            setError("Enter a message to send.");
            return;
        }
        if (deliveryMode === "scheduled" && !scheduledAt) {
            setError("Choose a date and time for the scheduled broadcast.");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                space: Number(spaceId),
                message: message.trim(),
                status: deliveryMode === "now" ? "sent" : "scheduled",
                ...(deliveryMode === "scheduled"
                    ? { scheduled_at: new Date(scheduledAt).toISOString() }
                    : {}),
            };
            const created = await post<Broadcast>("sms/broadcasts/", payload);
            setBroadcasts((current) => [created, ...current]);
            setMessage("");
            setScheduledAt("");
            setNotice(
                deliveryMode === "now"
                    ? "The SMS broadcast was sent."
                    : "The SMS broadcast was scheduled.",
            );
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Unable to create the SMS broadcast.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <header>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
                    Communications
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    SMS broadcasts
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Send a message to a Space or schedule it for later.
                </p>
            </header>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-xl border border-slate-200 bg-white p-5"
                >
                    <div>
                        <label
                            htmlFor="sms-space"
                            className="mb-2 block text-sm font-medium text-slate-800"
                        >
                            Space
                        </label>
                        <select
                            id="sms-space"
                            value={spaceId}
                            onChange={(event) => setSpaceId(event.target.value)}
                            disabled={loading || spaces.length === 0}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                        >
                            {spaces.length === 0 ? (
                                <option value="">No Spaces available</option>
                            ) : (
                                spaces.map((space) => (
                                    <option key={space.id} value={space.id}>
                                        {space.name}
                                        {typeof space.members_count === "number"
                                            ? ` (${space.members_count} members)`
                                            : ""}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <fieldset>
                        <legend className="mb-2 text-sm font-medium text-slate-800">
                            Delivery
                        </legend>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
                                <input
                                    type="radio"
                                    name="delivery-mode"
                                    value="now"
                                    checked={deliveryMode === "now"}
                                    onChange={() => setDeliveryMode("now")}
                                    className="accent-orange-600"
                                />
                                <Send className="size-4 text-orange-600" />
                                Send now
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
                                <input
                                    type="radio"
                                    name="delivery-mode"
                                    value="scheduled"
                                    checked={deliveryMode === "scheduled"}
                                    onChange={() => setDeliveryMode("scheduled")}
                                    className="accent-orange-600"
                                />
                                <CalendarClock className="size-4 text-orange-600" />
                                Schedule
                            </label>
                        </div>
                    </fieldset>

                    {deliveryMode === "scheduled" && (
                        <div>
                            <label
                                htmlFor="sms-scheduled-at"
                                className="mb-2 block text-sm font-medium text-slate-800"
                            >
                                Send date and time
                            </label>
                            <input
                                id="sms-scheduled-at"
                                type="datetime-local"
                                min={localDateTimeValue(new Date())}
                                value={scheduledAt}
                                onChange={(event) => setScheduledAt(event.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                required
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Recipients are taken from the Space when the message is sent.
                            </p>
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="sms-message"
                            className="mb-2 block text-sm font-medium text-slate-800"
                        >
                            Message
                        </label>
                        <textarea
                            id="sms-message"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            rows={5}
                            maxLength={1000}
                            placeholder="Write your SMS message..."
                            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            required
                        />
                        <p className="mt-1 text-right text-xs text-slate-500">
                            {message.length}/1000
                        </p>
                    </div>

                    {error && (
                        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </p>
                    )}
                    {notice && (
                        <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            {notice}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting || loading || spaces.length === 0}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {deliveryMode === "now" ? (
                            <Send className="size-4" />
                        ) : (
                            <CalendarClock className="size-4" />
                        )}
                        {submitting
                            ? "Saving..."
                            : deliveryMode === "now"
                              ? "Send broadcast"
                              : "Schedule broadcast"}
                    </button>
                </form>

                <section className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="mb-4 flex items-center gap-2">
                        <MessageSquare className="size-5 text-orange-600" />
                        <h2 className="text-base font-semibold text-slate-950">
                            Recent broadcasts
                        </h2>
                    </div>
                    {loading ? (
                        <p className="text-sm text-slate-500">Loading broadcasts...</p>
                    ) : broadcasts.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                            No broadcasts yet.
                        </p>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {broadcasts.map((broadcast) => (
                                <li key={broadcast.id} className="space-y-2 py-4 first:pt-0">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="text-sm font-medium text-slate-900">
                                            {broadcast.space_name}
                                        </p>
                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                                            {broadcast.status}
                                        </span>
                                    </div>
                                    <p className="line-clamp-2 text-sm text-slate-600">
                                        {broadcast.message}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {broadcast.recipients_count} recipients
                                        {" · "}
                                        {broadcast.scheduled_at
                                            ? `Scheduled ${new Date(broadcast.scheduled_at).toLocaleString()}`
                                            : new Date(broadcast.created_at).toLocaleString()}
                                    </p>
                                    {broadcast.failure_reason && (
                                        <p className="text-xs text-red-700">
                                            {broadcast.failure_reason}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}
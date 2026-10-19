"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Download, Plus, Save, Trash2, Upload, Users } from "lucide-react";

import { del, get, patch, post } from "@/lib/api/api";

type Space = {
    id: number;
    name: string;
    description: string;
    is_public: boolean;
    is_active: boolean;
    members_count: number;
    pin: string;
};

type SpaceMember = {
    id: number;
    name: string | null;
    phone_number: string;
    role: string;
};

type ApiList<T> = { results: T[] };
type SpaceForm = Pick<Space, "name" | "description" | "is_public" | "is_active">;

function listResults<T>(response: ApiList<T> | T[]): T[] {
    return Array.isArray(response) ? response : response.results;
}

const emptySpace: SpaceForm = {
    name: "",
    description: "",
    is_public: true,
    is_active: true,
};

export default function SpacesPage() {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [members, setMembers] = useState<SpaceMember[]>([]);
    const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null);
    const [spaceForm, setSpaceForm] = useState<SpaceForm>(emptySpace);
    const [memberName, setMemberName] = useState("");
    const [memberPhone, setMemberPhone] = useState("");
    const [memberRole, setMemberRole] = useState("member");
    const [loading, setLoading] = useState(true);
    const [savingSpace, setSavingSpace] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const selectedSpace =
        spaces.find((space) => space.id === selectedSpaceId) ?? null;

    const loadSpaces = useCallback(async () => {
        const response = await get<ApiList<Space> | Space[]>("spaces/");
        const items = listResults(response);
        setSpaces(items);
        setSelectedSpaceId((current) =>
            current && items.some((space) => space.id === current)
                ? current
                : items[0]?.id ?? null,
        );
        return items;
    }, []);

    const loadMembers = useCallback(async (spaceId: number) => {
        const response = await get<ApiList<SpaceMember> | SpaceMember[]>(
            `spaces/${spaceId}/members/`,
        );
        setMembers(listResults(response));
    }, []);

    useEffect(() => {
        let active = true;

        async function loadPage() {
            try {
                const response = await get<ApiList<Space> | Space[]>("spaces/");
                if (active) {
                    const items = listResults(response);
                    setSpaces(items);
                    setSelectedSpaceId(items[0]?.id ?? null);
                    if (items[0]) {
                        setSpaceForm({
                            name: items[0].name,
                            description: items[0].description,
                            is_public: items[0].is_public,
                            is_active: items[0].is_active,
                        });
                        const memberResponse = await get<
                            ApiList<SpaceMember> | SpaceMember[]
                        >(`spaces/${items[0].id}/members/`);
                        if (active) setMembers(listResults(memberResponse));
                    }
                }
            } catch (loadError) {
                if (active) setError(getErrorMessage(loadError));
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadPage();
        return () => {
            active = false;
        };
    }, []);

    async function handleSelectSpace(space: Space) {
        setSelectedSpaceId(space.id);
        setSpaceForm({
            name: space.name,
            description: space.description,
            is_public: space.is_public,
            is_active: space.is_active,
        });
        setMembers([]);
        setError("");
        setNotice("");
        try {
            await loadMembers(space.id);
        } catch (loadError) {
            setError(getErrorMessage(loadError));
        }
    }

    async function handleSaveSpace(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setNotice("");
        setSavingSpace(true);

        try {
            let createdSpace: Space | null = null;
            if (selectedSpace) {
                await patch<Space>(`spaces/${selectedSpace.id}/`, spaceForm);
                setNotice("Space updated.");
            } else {
                createdSpace = await post<Space>("spaces/", spaceForm);
                setNotice("Space created.");
            }
            await loadSpaces();
            if (createdSpace) {
                setSelectedSpaceId(createdSpace.id);
                setSpaceForm({
                    name: createdSpace.name,
                    description: createdSpace.description,
                    is_public: createdSpace.is_public,
                    is_active: createdSpace.is_active,
                });
                await loadMembers(createdSpace.id);
            }
        } catch (saveError) {
            setError(getErrorMessage(saveError));
        } finally {
            setSavingSpace(false);
        }
    }

    async function handleDeleteSpace() {
        if (!selectedSpace) return;
        const confirmed = window.confirm(
            `Delete "${selectedSpace.name}" and its members? This cannot be undone.`,
        );
        if (!confirmed) return;

        setError("");
        setNotice("");
        try {
            await del(`spaces/${selectedSpace.id}/`);
            setNotice("Space deleted.");
            setSpaceForm(emptySpace);
            setMembers([]);
            const remainingSpaces = await loadSpaces();
            const nextSpace = remainingSpaces[0];
            if (nextSpace) {
                setSelectedSpaceId(nextSpace.id);
                setSpaceForm({
                    name: nextSpace.name,
                    description: nextSpace.description,
                    is_public: nextSpace.is_public,
                    is_active: nextSpace.is_active,
                });
                await loadMembers(nextSpace.id);
            } else {
                setSelectedSpaceId(null);
            }
        } catch (deleteError) {
            setError(getErrorMessage(deleteError));
        }
    }

    async function handleAddMember(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!selectedSpace) return;
        setError("");
        setNotice("");

        try {
            await post<SpaceMember>(`spaces/${selectedSpace.id}/members/`, {
                name: memberName.trim(),
                phone_number: memberPhone.trim(),
                role: memberRole,
            });
            setMemberName("");
            setMemberPhone("");
            setMemberRole("member");
            setNotice("Member added.");
            await loadMembers(selectedSpace.id);
            await loadSpaces();
        } catch (memberError) {
            setError(getErrorMessage(memberError));
        }
    }

    async function handleRemoveMember(member: SpaceMember) {
        if (!selectedSpace) return;
        setError("");
        setNotice("");
        try {
            await del(
                `spaces/${selectedSpace.id}/members/${member.id}/`,
            );
            setNotice("Member removed.");
            await loadMembers(selectedSpace.id);
            await loadSpaces();
        } catch (memberError) {
            setError(getErrorMessage(memberError));
        }
    }

    async function handleImportMembers(file: File | undefined) {
        if (!selectedSpace || !file) return;
        setError("");
        setNotice("");
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                `/api/backend/spaces/${selectedSpace.id}/members/import-csv/`,
                { method: "POST", body: formData, credentials: "same-origin" },
            );
            const payload = await response.json();
            if (!response.ok) {
                throw new Error(payload.detail ?? "Unable to import members.");
            }
            setNotice(payload.message);
            await loadMembers(selectedSpace.id);
            await loadSpaces();
        } catch (importError) {
            setError(getErrorMessage(importError));
        }
    }

    return (
        <div className="space-y-6">
            <header>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
                    Organization
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    Spaces
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Create and manage community Spaces and their members.
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
                </p>
            )}

            <div className="grid items-start gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
                <section className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-950">Your Spaces</h2>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedSpaceId(null);
                                setSpaceForm(emptySpace);
                                setMembers([]);
                                setError("");
                                setNotice("");
                            }}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-orange-700 hover:bg-orange-50"
                        >
                            <Plus className="size-4" />
                            New
                        </button>
                    </div>

                    {loading ? (
                        <p className="py-4 text-sm text-slate-500">Loading Spaces...</p>
                    ) : spaces.length === 0 ? (
                        <p className="py-4 text-sm text-slate-500">
                            No Spaces yet. Create one to get started.
                        </p>
                    ) : (
                        <ul className="space-y-1">
                            {spaces.map((space) => (
                                <li key={space.id}>
                                    <button
                                        type="button"
                                        onClick={() => void handleSelectSpace(space)}
                                        className={`w-full rounded-lg px-3 py-2 text-left transition ${
                                            selectedSpaceId === space.id
                                                ? "bg-orange-50 text-orange-800"
                                                : "text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        <span className="block truncate text-sm font-medium">
                                            {space.name}
                                        </span>
                                        <span className="mt-0.5 block text-xs text-slate-500">
                                            {space.members_count} members
                                            {" · "}
                                            {space.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <div className="space-y-6">
                    <form
                        onSubmit={handleSaveSpace}
                        className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="font-semibold text-slate-950">
                                {selectedSpace ? "Space details" : "Create a Space"}
                            </h2>
                            {selectedSpace && (
                                <button
                                    type="button"
                                    onClick={handleDeleteSpace}
                                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="size-4" />
                                    Delete
                                </button>
                            )}
                        </div>

                        <div>
                            <label htmlFor="space-name" className="mb-1 block text-sm font-medium text-slate-800">
                                Name
                            </label>
                            <input
                                id="space-name"
                                required
                                maxLength={100}
                                value={spaceForm.name}
                                onChange={(event) =>
                                    setSpaceForm({ ...spaceForm, name: event.target.value })
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="space-description" className="mb-1 block text-sm font-medium text-slate-800">
                                Description
                            </label>
                            <textarea
                                id="space-description"
                                rows={3}
                                value={spaceForm.description}
                                onChange={(event) =>
                                    setSpaceForm({
                                        ...spaceForm,
                                        description: event.target.value,
                                    })
                                }
                                className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                        </div>

                        <div className="flex flex-wrap gap-5">
                            <label className="flex items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={spaceForm.is_public}
                                    onChange={(event) =>
                                        setSpaceForm({
                                            ...spaceForm,
                                            is_public: event.target.checked,
                                        })
                                    }
                                    className="accent-orange-600"
                                />
                                Public
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={spaceForm.is_active}
                                    onChange={(event) =>
                                        setSpaceForm({
                                            ...spaceForm,
                                            is_active: event.target.checked,
                                        })
                                    }
                                    className="accent-orange-600"
                                />
                                Active
                            </label>
                        </div>

                        {selectedSpace && (
                            <p className="text-xs text-slate-500">
                                Space access PIN: <span className="font-semibold">{selectedSpace.pin}</span>
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={savingSpace}
                            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
                        >
                            {selectedSpace ? <Save className="size-4" /> : <Plus className="size-4" />}
                            {savingSpace
                                ? "Saving..."
                                : selectedSpace
                                  ? "Save changes"
                                  : "Create Space"}
                        </button>
                    </form>

                    {selectedSpace && (
                        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <Users className="size-5 text-orange-600" />
                                    <h2 className="font-semibold text-slate-950">Members</h2>
                                    <span className="text-sm text-slate-500">
                                        ({members.length})
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                        <Upload className="size-4" />
                                        Import CSV
                                        <input
                                            type="file"
                                            accept=".csv,text/csv"
                                            className="sr-only"
                                            onChange={(event) => {
                                                void handleImportMembers(event.target.files?.[0]);
                                                event.currentTarget.value = "";
                                            }}
                                        />
                                    </label>
                                    <a
                                        href={`/api/backend/spaces/${selectedSpace.id}/members/export/`}
                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        <Download className="size-4" />
                                        Export
                                    </a>
                                </div>
                            </div>

                            <form
                                onSubmit={handleAddMember}
                                className="grid gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_150px_auto]"
                            >
                                <input
                                    aria-label="Member name"
                                    placeholder="Name"
                                    value={memberName}
                                    onChange={(event) => setMemberName(event.target.value)}
                                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                                />
                                <input
                                    aria-label="Member phone number"
                                    placeholder="Phone number"
                                    type="tel"
                                    required
                                    value={memberPhone}
                                    onChange={(event) => setMemberPhone(event.target.value)}
                                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                                />
                                <select
                                    aria-label="Member role"
                                    value={memberRole}
                                    onChange={(event) => setMemberRole(event.target.value)}
                                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                                >
                                    <option value="member">Member</option>
                                    <option value="admin">Administrator</option>
                                    <option value="communications">Communications</option>
                                    <option value="secretary">Secretary</option>
                                </select>
                                <button
                                    type="submit"
                                    className="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                                >
                                    Add member
                                </button>
                            </form>

                            {members.length === 0 ? (
                                <p className="py-3 text-sm text-slate-500">
                                    No members in this Space yet.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="text-xs uppercase text-slate-500">
                                            <tr>
                                                <th className="py-2 pr-4 font-medium">Name</th>
                                                <th className="py-2 pr-4 font-medium">Phone</th>
                                                <th className="py-2 pr-4 font-medium">Role</th>
                                                <th className="py-2 text-right font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {members.map((member) => (
                                                <tr key={member.id}>
                                                    <td className="py-3 pr-4 text-slate-900">
                                                        {member.name || "—"}
                                                    </td>
                                                    <td className="py-3 pr-4 text-slate-700">
                                                        {member.phone_number}
                                                    </td>
                                                    <td className="py-3 pr-4 capitalize text-slate-700">
                                                        {member.role}
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => void handleRemoveMember(member)}
                                                            aria-label={`Remove ${member.name || member.phone_number}`}
                                                            className="rounded-md p-2 text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "The request could not be completed.";
}
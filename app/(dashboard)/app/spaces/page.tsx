"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Download, Ellipsis, Pencil, Plus, Save, Trash2, Upload, UserRoundPlus, Users } from "lucide-react";

import { del, get, patch, post } from "@/lib/api/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    const [savingMember, setSavingMember] = useState(false);
    const [spaceDialogOpen, setSpaceDialogOpen] = useState(false);
    const [memberDialogOpen, setMemberDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<SpaceMember | null>(null);
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
            setSpaceDialogOpen(false);
        } catch (saveError) {
            setError(getErrorMessage(saveError));
        } finally {
            setSavingSpace(false);
        }
    }

    async function handleDeleteSpace(spaceToDelete = selectedSpace) {
        if (!spaceToDelete) return;
        const confirmed = window.confirm(
            `Delete "${spaceToDelete.name}" and its members? This cannot be undone.`,
        );
        if (!confirmed) return;

        setError("");
        setNotice("");
        try {
            await del(`spaces/${spaceToDelete.id}/`);
            setNotice("Space deleted.");
            const wasSelected = selectedSpaceId === spaceToDelete.id;
            const remainingSpaces = await loadSpaces();
            if (wasSelected) {
                const nextSpace = remainingSpaces[0];
                setSpaceForm(
                    nextSpace
                        ? {
                              name: nextSpace.name,
                              description: nextSpace.description,
                              is_public: nextSpace.is_public,
                              is_active: nextSpace.is_active,
                          }
                        : emptySpace,
                );
                setMembers([]);
                if (nextSpace) await loadMembers(nextSpace.id);
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
        setSavingMember(true);

        try {
            const payload = {
                name: memberName.trim(),
                phone_number: memberPhone.trim(),
                role: memberRole,
            };
            if (editingMember) {
                await patch<SpaceMember>(
                    `spaces/${selectedSpace.id}/members/${editingMember.id}/`,
                    payload,
                );
            } else {
                await post<SpaceMember>(`spaces/${selectedSpace.id}/members/`, payload);
            }
            setMemberName("");
            setMemberPhone("");
            setMemberRole("member");
            setEditingMember(null);
            setMemberDialogOpen(false);
            setNotice(editingMember ? "Member updated." : "Member added.");
            await loadMembers(selectedSpace.id);
            await loadSpaces();
        } catch (memberError) {
            setError(getErrorMessage(memberError));
        } finally {
            setSavingMember(false);
        }
    }

    function handleCreateSpace() {
        setSelectedSpaceId(null);
        setSpaceForm(emptySpace);
        setMembers([]);
        setError("");
        setNotice("");
        setSpaceDialogOpen(true);
    }

    function handleEditMember(member: SpaceMember) {
        setEditingMember(member);
        setMemberName(member.name ?? "");
        setMemberPhone(member.phone_number);
        setMemberRole(member.role);
        setError("");
        setNotice("");
        setMemberDialogOpen(true);
    }

    function handleAddMemberOpen() {
        setEditingMember(null);
        setMemberName("");
        setMemberPhone("");
        setMemberRole("member");
        setError("");
        setNotice("");
        setMemberDialogOpen(true);
    }

    function handleEditSpace(space: Space) {
        setSelectedSpaceId(space.id);
        setSpaceForm({
            name: space.name,
            description: space.description,
            is_public: space.is_public,
            is_active: space.is_active,
        });
        setError("");
        setNotice("");
        setSpaceDialogOpen(true);
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
                <button
                    type="button"
                    onClick={handleCreateSpace}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                    <Plus className="size-4" />
                    Create Space
                </button>
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
                            onClick={handleCreateSpace}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-orange-700 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                        >
                            <Plus className="size-4" />
                            New
                        </button>
                    </div>

                    {loading ? (
                        <p className="py-4 text-sm text-slate-500">Loading Spaces...</p>
                    ) : spaces.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center">
                            <Users className="mx-auto size-6 text-slate-400" />
                            <p className="mt-2 text-sm font-medium text-slate-700">
                                No Spaces yet
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Create a Space to organize members and send messages.
                            </p>
                            <button
                                type="button"
                                onClick={handleCreateSpace}
                                className="mt-3 text-sm font-semibold text-orange-700 hover:text-orange-800"
                            >
                                Create your first Space
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {spaces.map((space) => (
                                <li
                                    key={space.id}
                                    className={`flex items-center gap-1 rounded-lg pr-1 ${
                                        selectedSpaceId === space.id
                                            ? "bg-orange-50"
                                            : "hover:bg-slate-50"
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => void handleSelectSpace(space)}
                                        className={`min-w-0 flex-1 rounded-lg px-3 py-2 text-left transition ${
                                            selectedSpaceId === space.id
                                                ? "text-orange-800"
                                                : "text-slate-700"
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
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            className="flex size-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                                            aria-label={`Options for ${space.name}`}
                                        >
                                            <Ellipsis className="size-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem onClick={() => void handleSelectSpace(space)}>
                                                <Users className="size-4" />
                                                Manage
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleEditSpace(space)}>
                                                <Pencil className="size-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onClick={() => void handleDeleteSpace(space)}
                                            >
                                                <Trash2 className="size-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <div className="space-y-6">
                    {selectedSpace ? (
                        <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-lg font-semibold text-slate-950">{selectedSpace.name}</h2>
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${selectedSpace.is_active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                                        {selectedSpace.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-slate-500">
                                    {selectedSpace.description || "Manage this Space and its members."}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleEditSpace(selectedSpace)}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                <Pencil className="size-4" />
                                Edit Space
                            </button>
                        </section>
                    ) : (
                        <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                            <Users className="mx-auto size-7 text-slate-400" />
                            <p className="mt-3 text-sm font-medium text-slate-800">Choose a Space to manage</p>
                            <p className="mt-1 text-sm text-slate-500">
                                Select an existing Space or create a new one to get started.
                            </p>
                        </section>
                    )}

                    <Dialog open={spaceDialogOpen} onOpenChange={setSpaceDialogOpen}>
                        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{selectedSpace ? "Edit Space" : "Create a Space"}</DialogTitle>
                                <DialogDescription>
                                    {selectedSpace
                                        ? "Update the Space name, description, and visibility."
                                        : "Set up a Space to organize your community."}
                                </DialogDescription>
                            </DialogHeader>
                    <form
                        onSubmit={handleSaveSpace}
                        className="space-y-4"
                    >

                        <div>
                            <label htmlFor="space-name" className="mb-1 block text-sm font-medium text-slate-800">
                                Space name <span className="text-red-600">*</span>
                            </label>
                            <input
                                id="space-name"
                                required
                                maxLength={100}
                                value={spaceForm.name}
                                placeholder="e.g. Community members"
                                onChange={(event) =>
                                    setSpaceForm({ ...spaceForm, name: event.target.value })
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
                                placeholder="Add a short description to help identify this Space."
                                onChange={(event) =>
                                    setSpaceForm({
                                        ...spaceForm,
                                        description: event.target.value,
                                    })
                                }
                                className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50">
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
                                <span>
                                    <span className="block font-medium">Public Space</span>
                                    <span className="mt-0.5 block text-xs text-slate-500">
                                        Visible to people with access to your organization.
                                    </span>
                                </span>
                            </label>
                            <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50">
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
                                <span>
                                    <span className="block font-medium">Active</span>
                                    <span className="mt-0.5 block text-xs text-slate-500">
                                        Available for new communications.
                                    </span>
                                </span>
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
                        </DialogContent>
                    </Dialog>

                    {selectedSpace && (
                        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Users className="size-5 text-orange-600" />
                                        <h2 className="font-semibold text-slate-950">Members</h2>
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                            {members.length}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Add people individually or import a CSV list.
                                    </p>
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
                                    <button
                                        type="button"
                                        onClick={handleAddMemberOpen}
                                        className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                                    >
                                        <UserRoundPlus className="size-4" />
                                        Add member
                                    </button>
                                </div>
                            </div>

                            <Dialog
                                open={memberDialogOpen}
                                onOpenChange={(open) => {
                                    setMemberDialogOpen(open);
                                    if (!open) setEditingMember(null);
                                }}
                            >
                                <DialogContent className="max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>{editingMember ? "Edit member" : "Add a member"}</DialogTitle>
                                        <DialogDescription>
                                            {editingMember
                                                ? `Update contact details for ${editingMember.name || editingMember.phone_number}.`
                                                : `Add a person to ${selectedSpace.name}.`}
                                        </DialogDescription>
                                    </DialogHeader>
                            <form onSubmit={handleAddMember} className="space-y-4">
                                <div>
                                    <label htmlFor="member-name" className="mb-1 block text-xs font-medium text-slate-700">
                                        Full name
                                    </label>
                                    <input
                                        id="member-name"
                                        placeholder="e.g. Alex Namara"
                                        autoComplete="name"
                                        value={memberName}
                                        onChange={(event) => setMemberName(event.target.value)}
                                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="member-phone" className="mb-1 block text-xs font-medium text-slate-700">
                                        Phone number <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="member-phone"
                                        placeholder="e.g. 07XX XXX XXX"
                                        type="tel"
                                        autoComplete="tel"
                                        required
                                        value={memberPhone}
                                        onChange={(event) => setMemberPhone(event.target.value)}
                                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="member-role" className="mb-1 block text-xs font-medium text-slate-700">
                                        Role
                                    </label>
                                    <select
                                        id="member-role"
                                        value={memberRole}
                                        onChange={(event) => setMemberRole(event.target.value)}
                                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                    >
                                        <option value="member">Member</option>
                                        <option value="admin">Administrator</option>
                                        <option value="communications">Communications</option>
                                        <option value="secretary">Secretary</option>
                                    </select>
                                </div>
                                <DialogFooter>
                                    <button
                                        type="button"
                                        onClick={() => setMemberDialogOpen(false)}
                                        className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={savingMember}
                                        className="rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {savingMember
                                            ? editingMember ? "Saving..." : "Adding..."
                                            : editingMember ? "Save changes" : "Add member"}
                                    </button>
                                </DialogFooter>
                            </form>
                                </DialogContent>
                            </Dialog>

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
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                                                                aria-label={`Options for ${member.name || member.phone_number}`}
                                                            >
                                                                <Ellipsis className="size-4" />
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-40">
                                                                <DropdownMenuItem onClick={() => handleEditMember(member)}>
                                                                    <Pencil className="size-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    variant="destructive"
                                                                    onClick={() => void handleRemoveMember(member)}
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                    Remove
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
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
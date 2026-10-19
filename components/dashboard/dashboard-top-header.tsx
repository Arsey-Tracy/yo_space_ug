"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Bell, Command, Menu, Moon, Search, Sun } from "lucide-react";
import { DashboardSidebar } from "./dashboard-sidebar";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function DashboardTopbar(){
    const [dark, setDark] = useState(false);

    return (
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-white px-4 backdrop-blur sm:px-6">
            <Sheet>
                <SheetTrigger>
                    <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open Naviation">
                        <Menu className="size-5"/>
                    </Button>
                </SheetTrigger>

                <SheetContent side="left" className="w-[280px] p-0">
                    <SheetTitle className="sr-only">YoSpaces navigation</SheetTitle>
                    <DashboardSidebar/>
                </SheetContent>
            </Sheet>
            <div className="relatve hidden w-full max-w-[440px] md:block">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input placeholder="Serch messages, contact, spaces..." className="h-10 border-slate-200 bg-slate-50 pl-9 pr-12 text-sm focus-visible:ring-orange-500" aria-label="search yospace"/>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded border bg-white px-1.5 py-0.5 text-[10px] text-slate-400"><Command className="size-3"/></span>
            </div>

            <div className="ml-auto flex items-center gap-1 sm:gap-3">
                <div className="hidden items-center gap-2 text-xs text-slate-500 xl:flex"><span className="size-2 rounded-full bg-emerald-500"/>Systems operational</div>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="relative text-slate-600">
                    <Bell className="sie-[18px]"/>
                    <span className="absolute right-1.5 size-2 rounded-full bg-orange-500 ring-2 ring-white"/>
                </Button>
                <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setDark(!dark)} className="text-slate-600">
                    {dark ? (
                        <Sun className="size-[18px]"/>
                    ): (<Moon className="size-[18px]"/>)}
                </Button>
                <div className="mx-1 hidden h-8 w-px bg-slate-20 sm:block"/>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" className="h-auto gap-2 px-1.5 py-1">
                            <Avatar className="size-9">
                                <AvatarFallback className="bg-orange-100 text-xs font-semibold text-orange-700">YS</AvatarFallback>
                            </Avatar>
                            <span className="hidden text-left sm:block">
                                <span className="block text-xs font-semibold text-slate-900">Account Owner </span>
                                <span className="block text-[11px] text-sate-500">Org Admin</span>
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator/>

                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Organization Settings</DropdownMenuItem>
                        <DropdownMenuItem>Billing and Wallet</DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            className="text-red-600"
                            onSelect={async () => {
                                await fetch("/api/auth/logout", { method: "POST" });
                                window.location.assign("/login");
                            }}
                        >
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
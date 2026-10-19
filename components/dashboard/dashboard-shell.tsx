"use client"
import { ReactNode } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";
import DashboardTopbar from "./dashboard-top-header";

export default function DashboardShell({children,}: {children: ReactNode;}) {
    return (
        <div className="min-h-screen bg-slate-50/70">
            <div className="flex min-h-screen">
                <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
                    <DashboardSidebar/>
                </div>
                <div className="flex min-w-0 flex-1 flex-col lg:pl-[252px]">
                    <DashboardTopbar/>
                    <main className="min-w-0 flex-1 p-4 sm:p-6 xl:p-8">
                        <div className="mx-auto w-full max-w-[1600px]">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
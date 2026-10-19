"use client"
import { ReactNode } from "react";

type DashboardPageHeaderProps = {
    title: string;
    description?: string;
    eyebrow?: string;
    actions?: ReactNode;
}
export function DashboardPageHeader({title, description, eyebrow, actions,}: DashboardPageHeaderProps){
    return(
        <div className="mb-6 flex flex-collectMeta gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                {eyebrow && (<p className="mb-1 text-xs font-medium text-orange-600">{eyebrow}</p>)}
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
                {description && (<p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>)}
            </div>
            {actions && (<div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>)}
        </div>
    );
}
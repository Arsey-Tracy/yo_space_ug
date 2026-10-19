"use client"
import Link from "next/link";
import { cn } from "@/lib/utils"
import { Activity, AudioLines, ChartNoAxesColumn, ChevronDown, Clock,  Code2, LayoutDashboard, MessageCirclePlus, MessageSquare,  Settings2,  UsbIcon, Wallet, Webhook } from "lucide-react";
import { usePathname } from "next/navigation";


const groups = [
    {
        label: "", 
        items: [
            {label: "Dashboard", href: "/app", icon: LayoutDashboard},
        ],
    },
    {
        label: "Organiation", 
        items: [
            {label: "Spaces", href: "/app/spaces", icon: MessageSquare},
        ],
    },
    {
        label: "Communications", 
        items: [
            {label: "SMS", href: "/app/sms", icon: MessageSquare},
            {label: "Voice", href: "/app/voice", icon: AudioLines},
            {label: "USSD", href: "/app/ussd", icon: Webhook, badge: "Soon",},
            {label: "WhatsApp", href: "/app/whatsapp", icon: MessageCirclePlus, badge: "Soon",},
            {label: "Schedule", href: "/app/schedule", icon: Clock ,},
            {label: "WorkFlow", href: "/app/workflow", icon: UsbIcon, badge: "Soon",},
        ],
    },
    {
        label: "Billing", 
        items: [
            {label: "Wallet", href: "/app/wallet", icon: Wallet},
        ],
    },
    {
        label: "Analytics", 
        items: [
            {label: "Analytics", href: "/app/analytics", icon: ChartNoAxesColumn},
            {label: "Report", href: "/app/reports", icon: Activity},
        ],
    },
    {
        label: "Setting", 
        items: [
            {label: "Settings", href: "/app/analytics", icon: Settings2},
        ],
    },
     {
        label: "Developers", 
        items: [
            {label: "Developer Platform", href: "/app/developers", icon: Code2, badge: "Beta"},
        ],
    },
];

type Props = {
    onNavigate?: ()  => void;
}

export function DashboardSidebar({onNavigate}: Props){
    const pathname  = usePathname();

    return (
        <aside className="flex h-full w-[252px] shrink-0 flex-col border-r bg-white">
            <Link href="/app" onClick={onNavigate} className="flex items-center gap-3 border-b px-5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-orange-500 text-white">
                    <MessageSquare className="size-5 fill-current"/>
                </span>
                <span className="text-xl font-bold tracking-tight text-slate-950">
                    YoSpace
                </span>
            </Link>
            <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
                {groups.map((group) => (
                    <section key={group.label || "main"} className="space-y-1">
                        {group.label && (
                            <p className="px-3 pb-2 text-[10x] font-bold uppercase tracking-[0.14em] text-slate-400">
                                {group.label}
                            </p>
                        )}
                        {group.items.map((item)=> {
                            const Icon = item.icon;
                            const active = item.href === "/app" ? pathname == "/app" : pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <Link key={item.href} href={item.href} onClick={onNavigate} aria-current={active ? "page": undefined} className={
                                    cn("group flex min-h-9 items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors", active ? "bg-orange-50 text-orange-700": "text-slate-600 hover:bg-slate-50 hover:text-slate-950",)
                                }><Icon className={
                                    cn(
                                        "sie-[17px] shrink-0",
                                        active ? "text-orange-600": "text-slate-500 group-hover:text-slate-800"
                                    )
                                }/>
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                    <span className={
                                        cn(
                                            "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                            item.badge === "Soon" ? "bg-orange-50 text-orange-700": "bg-slate-100 text-slate-600",
                                        )}>{item.badge}
                                    </span>
                                )}
                                </Link>
                            )
                        })}
                    </section>
                ))}
            </nav>
            <div className="border-t p-3">
                <div className="rounded-xl border bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800">Organization</span>
                        <ChevronDown className="size-4 text-slate-500"/>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-500">Your Organiation</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full w-2/3 rounded-full-bg-orange-500"/>
                    </div>
                    <p className="mt-2 text-[10px] text-slate-500">
                        Usage and Plan overview
                    </p>
                </div>
            </div>
        </aside>
    );
}
"use client";

import {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {useAppContext} from "@/src/context/AppContext";

// ── Types ──────────────────────────────────────────────────────────────────────

interface NavChild {
    label: string;
    slug: string;
}

interface NavItemConfig {
    label: string;
    icon: string;
    slug?: string;
    children?: NavChild[];
}

// ── Nav config ─────────────────────────────────────────────────────────────────

const NAV: NavItemConfig[] = [
    {label: "Dashboard", icon: "ti-layout-dashboard", slug: "dashboard"},
    {
        label: "Products", icon: "ti-package",
        children: [
            {label: "All products", slug: "products"},
            {label: "Categories", slug: "categories"},
            {label: "Tags", slug: "tags"},
        ],
    },
    {label: "Media", icon: "ti-photo", slug: "media"},
    {label: "Orders", icon: "ti-shopping-cart", slug: "orders"},
    {label: "Database", icon: "ti-database", slug: "database"},
];

// ── NavItem ────────────────────────────────────────────────────────────────────


function NavItem({
                     item,
                     pathname,
                     onClose,
                     openMediaManager
                 }: {
    item: NavItemConfig;
    pathname: string;
    onClose?: () => void;
    openMediaManager: () => void;
}) {
    const router = useRouter();
    const hasChildren = !!item.children;
    const isChildActive = hasChildren && item.children!.some((c) => pathname.includes(c.slug));
    const isActive = !hasChildren && !!item.slug && pathname.includes(item.slug);
    const [open, setOpen] = useState(isChildActive);

    function handleRowClick() {
        if (hasChildren) {
            setOpen((v) => !v);
        } else if (item.slug == 'media') {
            openMediaManager();
        } else if (item.slug) {
            router.push(`/admin/${item.slug}`);
            onClose?.();
        }
    }

    function handleChildClick(slug: string) {
        router.push(`/admin/${slug}`);
        onClose?.();
    }

    return (
        <div className="mx-2 my-0.5">
            <button
                onClick={handleRowClick}
                className={[
                    "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm text-left transition-colors",
                    isActive || isChildActive
                        // Active: accent-light bg + accent text + semibold
                        ? "bg-[var(--admin-accent-light)] text-[var(--admin-accent)] font-semibold"
                        // Default: muted text, surface-hover on hover
                        : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-text)]",
                ].join(" ")}
            >
                <i className={`ti ${item.icon} text-base opacity-75`} aria-hidden="true"/>
                <span className="flex-1">{item.label}</span>
                {hasChildren && (
                    <i
                        className={`ti ti-chevron-down text-xs opacity-40 transition-transform ${open ? "rotate-180" : ""}`}
                        aria-hidden="true"
                    />
                )}
            </button>

            {hasChildren && open && (
                <div className="mt-0.5 mb-1">
                    {item.children!.map((child) => {
                        const childActive = pathname.includes(child.slug);

                        return (
                            <button
                                key={child.slug}
                                onClick={() => handleChildClick(child.slug)}
                                className={[
                                    "w-full flex items-center gap-1.5 pl-8 pr-3 py-1.5 rounded-md text-xs text-left transition-colors",
                                    childActive
                                        ? "text-[var(--admin-accent)] font-semibold"
                                        : "text-[var(--admin-text-faint)] hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-text-muted)]",
                                ].join(" ")}
                            >
                                <span className="w-1 h-1 rounded-full bg-current opacity-50 shrink-0"/>
                                {child.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────

interface SidebarProps {
    mobileOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({mobileOpen, onClose}: SidebarProps) {
    const pathname = usePathname();
    const { openMediaManager } = useAppContext();

    const content = (
        <div className="w-[220px] h-full flex flex-col border-r border-[var(--admin-border)] bg-[var(--admin-surface)]">

            {/* Logo */}
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-[var(--admin-border)]">
                <div
                    className="w-7 h-7 rounded-md flex items-center justify-center text-white text-[13px] font-semibold shrink-0 bg-[var(--admin-accent)]">
                    A
                </div>
                <span className="text-sm font-semibold text-[var(--admin-text)]">Admin</span>
            </div>

            {/* Section label */}
            <p className="px-4 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--admin-text-faint)]">
                Navigation
            </p>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto">
                {NAV.map((item) => (
                    <NavItem key={item.label} item={item} pathname={pathname} onClose={onClose} openMediaManager={openMediaManager}/>
                ))}
            </nav>

            {/* Divider */}
            <div className="mx-4 h-px bg-[var(--admin-border)]"/>

            {/* User footer */}
            <div className="flex items-center gap-2 px-4 py-3">
                <div
                    className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0 bg-[var(--admin-accent)]">
                    N
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold text-[var(--admin-text)] truncate">ndev</p>
                    <p className="text-[11px] text-[var(--admin-text-faint)]">Administrator</p>
                </div>
                <button
                    className="text-[var(--admin-text-faint)] hover:text-[var(--admin-text-muted)] transition-colors">
                    <i className="ti ti-settings text-[15px]" aria-hidden="true"/>
                </button>
            </div>

        </div>
    );

    return (
        <>
            {/* Desktop */}
            <div className="w-[220px] shrink-0 hidden md:block">
                <div className="fixed top-0 bottom-0 w-[220px]">{content}</div>
            </div>

            {/* Mobile */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/60" onClick={onClose}/>
                    <div className="absolute top-0 bottom-0 left-0 w-[220px]">{content}</div>
                </div>
            )}
        </>
    );
}
import { useState } from "react";
import NavItem from "@/src/modules/admin/Navitem";
import { useRouter } from "next/navigation";

// ── NAV CONFIG ─────────────────────────────────────────
const NAV = [
    { label: "Dashboard", icon: "dash" },
    {
        label: "Products",
        icon: "product",
        children: [
            { label: "All Products", slug: "products" },
            { label: "Add Product", slug: "products/add" },
            { label: "Categories", slug: "categories" },
            { label: "Tags", slug: "tags" },
        ],
    },
    { label: "Media", icon: "media" },
    { label: "Database", icon: "db" },
    { label: "Categories", icon: "category" },
];

export default function Sidebar({ mobileOpen, onClose }) {
    const [selected, setSelected] = useState("Dashboard");
    const router = useRouter();

    function handleSelect(label) {
        setSelected(label);

        const formattedLabel = label.toLowerCase().replace(/\s+/g, "-");
        router.push(`/admin/${formattedLabel}`);
    }

    const content = (
        <div className="w-56 h-full flex flex-col border-r">
            <div className="px-3 py-2 border-b text-xs uppercase text-white">
                Navigation
            </div>

            <div className="flex-1 overflow-y-auto">
                {NAV.map((item, index) => (
                    <NavItem
                        key={index}
                        item={item}
                        selected={selected}
                        onSelect={handleSelect}
                    />
                ))}
            </div>

            <div className="px-3 py-2 border-t text-xs text-center">
                AutoParts v1.0.0
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop */}
            <div className="w-56 shrink-0 hidden md:block">
                <div className="fixed top-0 bottom-0 w-56">
                    {content}
                </div>
            </div>

            {/* Mobile */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={onClose}
                    />
                    <div className="absolute top-0 bottom-0 left-0 w-56 bg-white">
                        {content}
                    </div>
                </div>
            )}
        </>
    );
}
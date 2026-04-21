"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import productApi, { Product, ProductListParams } from "@/src/api/productApi";
import categoryApi from "@/src/api/categoryApi";
import {Category} from "@/src/types";

// ── COLORS ────────────────────────────────────────────────────────────────────

const C = {
    bg: "#1a1d1e",
    surface: "#22262a",
    surfaceAlt: "#1e2226",
    surfaceHover: "#252b30",
    border: "#2e3338",
    text: "#e8eaed",
    textMuted: "#8b949e",
    textFaint: "#545d67",
    accent: "#2271b1",
    accentHover: "#1d6299",
    accentLight: "rgba(34,113,177,0.12)",
    success: "#1a7f37",
    successBg: "rgba(26,127,55,0.12)",
    warning: "#9a6700",
    warningBg: "rgba(154,103,0,0.12)",
    danger: "#d63638",
    dangerBg: "rgba(214,54,56,0.10)",
    inputBg: "#161b1f",
    inputBorder: "#3d444d",
};

// ── HELPERS ───────────────────────────────────────────────────────────────────

function formatPrice(price: number, sale?: number | null) {
    const fmt = (n: number) => `€${n.toFixed(2)}`;
    if (sale && sale > 0) {
        return (
            <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <span style={{ textDecoration: "line-through", color: C.textFaint, fontSize: 11 }}>{fmt(price)}</span>
        <span style={{ color: "#4caf50", fontWeight: 600 }}>{fmt(sale)}</span>
      </span>
        );
    }
    return <span style={{ color: C.text }}>{fmt(price)}</span>;
}

function StockBadge({ status, stock }: { status: string; stock: number }) {
    const map: Record<string, { label: string; color: string; bg: string }> = {
        IN_STOCK:      { label: "In stock",     color: C.success, bg: C.successBg },
        OUT_OF_STOCK:  { label: "Out of stock", color: C.danger,  bg: C.dangerBg },
        ON_BACKORDER:  { label: "On backorder", color: C.warning, bg: C.warningBg },
    };
    const s = map[status] ?? map.IN_STOCK;
    return (
        <span style={{ color: s.color, background: s.bg, padding: "2px 8px", borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" as const }}>
      {s.label}{stock > 0 ? ` (${stock})` : ""}
    </span>
    );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
    return isActive ? null : (
        <span style={{ color: C.textMuted, fontSize: 12, marginLeft: 4 }}>— Draft</span>
    );
}

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-CA") + " at " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

// ── FILTER BAR ────────────────────────────────────────────────────────────────

const selectStyle: React.CSSProperties = {
    background: C.inputBg,
    border: `1px solid ${C.inputBorder}`,
    borderRadius: 4,
    color: C.text,
    fontSize: 12,
    padding: "5px 28px 5px 9px",
    fontFamily: "inherit",
    outline: "none",
    appearance: "none" as const,
    cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238b949e'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
};

const btnStyle = (variant: "primary" | "secondary" | "danger" = "secondary"): React.CSSProperties => ({
    background: variant === "primary" ? C.accent : variant === "danger" ? C.dangerBg : C.surfaceAlt,
    border: `1px solid ${variant === "primary" ? C.accent : variant === "danger" ? C.danger : C.inputBorder}`,
    borderRadius: 4,
    color: variant === "primary" ? "#fff" : variant === "danger" ? C.danger : C.text,
    fontSize: 12,
    fontWeight: variant === "primary" ? 700 : 500,
    padding: "5px 12px",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
});

// ── HOOK ──────────────────────────────────────────────────────────────────────

function useProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal]       = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);

    const [params, setParams] = useState<ProductListParams & { tab: "all" | "draft" | "published" }>({
        tab: "all",
        page: 1,
        limit: 20,
        search: "",
        categoryId: "",
        stockStatus: undefined,
        isActive: undefined,
    });

    const [search, setSearch]         = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy]           = useState<"name" | "price" | "date">("date");
    const [sortDir, setSortDir]         = useState<"asc" | "desc">("desc");

    const searchTimer = useRef<ReturnType<typeof setTimeout>>();

    // Fetch categories once
    useEffect(() => {
        async function fetchCategories() {
            const responseData = await categoryApi.getAll();
            setCategories(responseData.data);
        }
        fetchCategories();
    }, []);

    const fetchProducts = useCallback(async (p: typeof params) => {
        setIsLoading(true);
        try {
            const isActive = p.tab === "all" ? undefined : p.tab === "published" ? true : false;
            const res = await productApi.list({
                page: p.page,
                limit: p.limit,
                search: p.search || undefined,
                categoryId: p.categoryId || undefined,
                stockStatus: p.stockStatus,
                isActive,
            });
            setProducts(res.data);
            setTotal(res.total);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchProducts(params); }, [params]);

    // Tabs
    const setTab = (tab: typeof params.tab) =>
        setParams(p => ({ ...p, tab, page: 1 }));

    // Filters
    const setCategory = (categoryId: string) =>
        setParams(p => ({ ...p, categoryId, page: 1 }));

    const setStockFilter = (stockStatus: string) =>
        setParams(p => ({ ...p, stockStatus: stockStatus as any || undefined, page: 1 }));

    // Search (debounced)
    const handleSearchChange = (v: string) => {
        setSearch(v);
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            setParams(p => ({ ...p, search: v, page: 1 }));
        }, 350);
    };

    const handleSearchSubmit = () =>
        setParams(p => ({ ...p, search, page: 1 }));

    // Sorting (client-side for current page)
    const sortedProducts = [...products].sort((a, b) => {
        let av: any, bv: any;
        if (sortBy === "name")  { av = a.name.toLowerCase(); bv = b.name.toLowerCase(); }
        if (sortBy === "price") { av = a.price; bv = b.price; }
        if (sortBy === "date")  { av = a.updatedAt; bv = b.updatedAt; }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1  : -1;
        return 0;
    });

    const toggleSort = (col: typeof sortBy) => {
        if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortBy(col); setSortDir("asc"); }
    };

    // Selection
    const toggleSelect = (id: string) =>
        setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const toggleSelectAll = () => {
        if (selectedIds.size === sortedProducts.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(sortedProducts.map(p => p.id)));
    };

    // Bulk actions
    const [bulkAction, setBulkAction] = useState("");

    const applyBulkAction = async () => {
        if (!bulkAction || selectedIds.size === 0) return;
        const ids = [...selectedIds];

        if (bulkAction === "delete") {
            if (!confirm(`Delete ${ids.length} product(s)? This cannot be undone.`)) return;
            await Promise.all(ids.map(id => productApi.delete(id)));
        } else if (bulkAction === "publish") {
            await Promise.all(ids.map(id => productApi.update(id, { isActive: true })));
        } else if (bulkAction === "draft") {
            await Promise.all(ids.map(id => productApi.update(id, { isActive: false })));
        }

        setSelectedIds(new Set());
        setBulkAction("");
        fetchProducts(params);
    };

    // Single item delete
    const deleteOne = async (id: string) => {
        if (!confirm("Delete this product?")) return;
        await productApi.delete(id);
        fetchProducts(params);
    };

    // Pagination
    const totalPages = Math.ceil(total / params.limit!);
    const setPage = (page: number) => setParams(p => ({ ...p, page }));

    return {
        products: sortedProducts,
        total,
        isLoading,
        categories,
        params,
        search,
        selectedIds,
        sortBy,
        sortDir,
        bulkAction,
        totalPages,
        setTab,
        setCategory,
        setStockFilter,
        handleSearchChange,
        handleSearchSubmit,
        toggleSort,
        toggleSelect,
        toggleSelectAll,
        setBulkAction,
        applyBulkAction,
        deleteOne,
        setPage,
        refresh: () => fetchProducts(params),
    };
}

// ── SORT ICON ─────────────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
    return (
        <svg width="10" height="12" viewBox="0 0 10 12" fill="none" style={{ marginLeft: 4, opacity: active ? 1 : 0.3 }}>
            <path d="M5 0L9 4H1L5 0Z" fill={active && dir === "asc" ? C.accent : C.textMuted} />
            <path d="M5 12L1 8H9L5 12Z" fill={active && dir === "desc" ? C.accent : C.textMuted} />
        </svg>
    );
}

// ── COLUMN HEADER ─────────────────────────────────────────────────────────────

function ColHeader({ label, sortKey, currentSort, currentDir, onSort }: {
    label: string;
    sortKey?: "name" | "price" | "date";
    currentSort: string;
    currentDir: "asc" | "desc";
    onSort?: (k: "name" | "price" | "date") => void;
}) {
    const isActive = sortKey === currentSort;
    return (
        <th
            onClick={() => sortKey && onSort?.(sortKey)}
            style={{
                padding: "10px 12px",
                textAlign: "left" as const,
                fontSize: 12,
                fontWeight: 700,
                color: isActive ? C.accent : C.textMuted,
                cursor: sortKey ? "pointer" : "default",
                whiteSpace: "nowrap" as const,
                userSelect: "none" as const,
                borderBottom: `2px solid ${C.border}`,
                background: C.surfaceAlt,
            }}
        >
            {label}
            {sortKey && <SortIcon active={isActive} dir={currentDir} />}
        </th>
    );
}

// ── PRODUCT ROW ───────────────────────────────────────────────────────────────

function ProductRow({ product, selected, onToggle, onDelete, router }: {
    product: Product;
    selected: boolean;
    onToggle: () => void;
    onDelete: () => void;
    router: ReturnType<typeof useRouter>;
}) {

    useEffect(() => {
        console.log(product)
    }, []);
    const [hovered, setHovered] = useState(false);
    const thumb = product.images[0];



    return (
        <tr
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: selected ? C.accentLight : hovered ? C.surfaceHover : C.surface,
                transition: "background 0.12s",
                cursor: "default",
            }}
        >
            {/* Checkbox */}
            <td style={{ padding: "10px 12px", width: 32 }}>
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onToggle}
                    style={{ accentColor: C.accent, width: 15, height: 15 }}
                />
            </td>

            {/* Thumb */}
            <td style={{ padding: "10px 8px", width: 46 }}>
                <div style={{ width: 36, height: 36, borderRadius: 4, overflow: "hidden", background: C.surfaceAlt, border: `1px solid ${C.border}`, flexShrink: 0 }}>
                    {thumb
                        ? <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" fill={C.surfaceAlt}/><circle cx="13" cy="14" r="3" stroke={C.textFaint} strokeWidth="1.2"/><path d="M6 26l7-7 5 5 4-4 8 6" stroke={C.textFaint} strokeWidth="1.2" strokeLinejoin="round"/></svg>
                    }
                </div>
            </td>

            {/* Name */}
            <td style={{ padding: "10px 12px", maxWidth: 320 }}>
                <div>
                    <button
                        onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                        style={{ background: "none", border: "none", padding: 0, color: product.isActive ? C.accent : C.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "left" as const }}
                    >
                        {product.name['en'] || <span style={{ color: C.textFaint }}>(no title)</span>}
                    </button>
                    <StatusBadge isActive={product.isActive} />
                    {/* Row actions on hover */}
                    {hovered && (
                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                            <button onClick={() => router.push(`/admin/products/${product.id}/edit`)} style={{ background: "none", border: "none", padding: 0, color: C.accent, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                                Edit
                            </button>
                            <span style={{ color: C.textFaint, fontSize: 11 }}>|</span>
                            <button onClick={onDelete} style={{ background: "none", border: "none", padding: 0, color: C.danger, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                                Trash
                            </button>
                            <span style={{ color: C.textFaint, fontSize: 11 }}>|</span>
                            <button onClick={() => window.open(`/products/${product.slug}`, "_blank")} style={{ background: "none", border: "none", padding: 0, color: C.textMuted, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                                View
                            </button>
                        </div>
                    )}
                </div>
            </td>

            {/* SKU */}
            <td style={{ padding: "10px 12px", fontSize: 12, color: C.textMuted }}>
                {product.sku || <span style={{ color: C.textFaint }}>–</span>}
            </td>

            {/* Stock */}
            <td style={{ padding: "10px 12px" }}>
                <StockBadge status={product.stockStatus} stock={product.stock} />
            </td>

            {/* Price */}
            <td style={{ padding: "10px 12px", fontSize: 13 }}>
                {formatPrice(product.price, product.salePrice)}
            </td>

            {/* Categories */}
            <td style={{ padding: "10px 12px", fontSize: 12, color: C.accent }}>
                {product.category?.name['en'] ?? <span style={{ color: C.textFaint }}>–</span>}
            </td>

            {/* Tags */}
            <td style={{ padding: "10px 12px", fontSize: 12, color: C.textMuted, maxWidth: 160 }}>
                {product.tags && product.tags.length > 0
                    ? product.tags.slice(0, 3).join(", ") + (product.tags.length > 3 ? `…` : "")
                    : <span style={{ color: C.textFaint }}>–</span>
                }
            </td>

            {/* Featured */}
            <td style={{ padding: "10px 12px", textAlign: "center" as const }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={product.images.length > 0 ? "#f5c518" : "none"} stroke={product.images.length > 0 ? "#f5c518" : C.textFaint} strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
            </td>

            {/* Date */}
            <td style={{ padding: "10px 12px", fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" as const }}>
                <div style={{ fontSize: 10, color: C.textFaint, marginBottom: 1 }}>Last Modified</div>
                {formatDate(product.updatedAt)}
            </td>
        </tr>
    );
}

// ── PAGINATION ────────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
        if (totalPages <= 7) return i + 1;
        if (page <= 4) return i + 1;
        if (page >= totalPages - 3) return totalPages - 6 + i;
        return page - 3 + i;
    });

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button onClick={() => onPage(page - 1)} disabled={page === 1} style={{ ...btnStyle(), opacity: page === 1 ? 0.4 : 1 }}>‹</button>
            {pages.map(p => (
                <button key={p} onClick={() => onPage(p)}
                        style={{ ...btnStyle(p === page ? "primary" : "secondary"), minWidth: 32, padding: "5px 8px" }}>
                    {p}
                </button>
            ))}
            <button onClick={() => onPage(page + 1)} disabled={page === totalPages} style={{ ...btnStyle(), opacity: page === totalPages ? 0.4 : 1 }}>›</button>
        </div>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function ProductsListPage() {
    const router = useRouter();
    const list = useProductList();

    const tabCounts: Record<string, number> = {
        all: list.total,
        draft: list.products.filter(p => !p.isActive).length,
        published: list.products.filter(p => p.isActive).length,
    };

    const TABS: { id: "all" | "draft" | "published"; label: string }[] = [
        { id: "all",       label: "All" },
        { id: "published", label: "Published" },
        { id: "draft",     label: "Draft" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

            {/* ── Page header ─────────────────────────────────────────────────────── */}
            <div style={{ padding: "20px 24px 0", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Products</h1>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button style={btnStyle("secondary")}>Import</button>
                        <button style={btnStyle("secondary")}>Export</button>
                        <button
                            onClick={() => router.push("/admin/products/add")}
                            style={btnStyle("primary")}
                        >
                            + Add new product
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 0 }}>
                    {TABS.map((tab, i) => (
                        <div key={tab.id} style={{ display: "flex", alignItems: "center" }}>
                            <button
                                onClick={() => list.setTab(tab.id)}
                                style={{
                                    background: "none", border: "none",
                                    borderBottom: list.params.tab === tab.id ? `2px solid ${C.accent}` : "2px solid transparent",
                                    color: list.params.tab === tab.id ? C.text : C.textMuted,
                                    fontSize: 13, fontWeight: list.params.tab === tab.id ? 600 : 400,
                                    padding: "8px 12px", cursor: "pointer", fontFamily: "inherit",
                                    transition: "all 0.12s",
                                }}
                            >
                                {tab.label}
                                <span style={{ marginLeft: 4, color: C.textFaint, fontSize: 12 }}>
                  ({tabCounts[tab.id] ?? 0})
                </span>
                            </button>
                            {i < TABS.length - 1 && <span style={{ color: C.textFaint, fontSize: 12, padding: "0 2px" }}>|</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Filter bar ──────────────────────────────────────────────────────── */}
            <div style={{ padding: "12px 24px", background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
                {/* Bulk actions */}
                <select
                    value={list.bulkAction}
                    onChange={e => list.setBulkAction(e.target.value)}
                    style={selectStyle}
                >
                    <option value="">Bulk actions</option>
                    <option value="publish">Set published</option>
                    <option value="draft">Set to draft</option>
                    <option value="delete">Delete</option>
                </select>
                <button
                    onClick={list.applyBulkAction}
                    disabled={!list.bulkAction || list.selectedIds.size === 0}
                    style={{ ...btnStyle(), opacity: (!list.bulkAction || list.selectedIds.size === 0) ? 0.5 : 1 }}
                >
                    Apply
                </button>

                <div style={{ width: 1, height: 22, background: C.border, margin: "0 4px" }} />

                {/* Category filter */}
                <select style={selectStyle} onChange={e => list.setCategory(e.target.value)}>
                    <option value="">Select a category</option>
                    {list.categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name['en']}</option>
                    ))}
                </select>

                {/* Stock status filter */}
                <select style={selectStyle} onChange={e => list.setStockFilter(e.target.value)}>
                    <option value="">Filter by stock status</option>
                    <option value="IN_STOCK">In stock</option>
                    <option value="OUT_OF_STOCK">Out of stock</option>
                    <option value="ON_BACKORDER">On backorder</option>
                </select>

                <button style={{ ...btnStyle("primary"), marginLeft: 2 }}>Filter</button>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Search */}
                <div style={{ display: "flex", gap: 6 }}>
                    <input
                        type="search"
                        placeholder="Search products…"
                        value={list.search}
                        onChange={e => list.handleSearchChange(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && list.handleSearchSubmit()}
                        style={{
                            background: C.inputBg, border: `1px solid ${C.inputBorder}`,
                            borderRadius: 4, color: C.text, fontSize: 12,
                            padding: "5px 10px", fontFamily: "inherit", outline: "none", width: 220,
                        }}
                    />
                    <button onClick={list.handleSearchSubmit} style={btnStyle("primary")}>
                        Search products
                    </button>
                </div>
            </div>

            {/* ── Table ───────────────────────────────────────────────────────────── */}
            <div style={{ padding: "16px 24px" }}>
                {/* Top pagination + count */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: C.textFaint }}>
            {list.total > 0 ? `${list.total} item${list.total !== 1 ? "s" : ""}` : ""}
          </span>
                    <Pagination page={list.params.page!} totalPages={list.totalPages} onPage={list.setPage} />
                </div>

                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
                        <thead>
                        <tr>
                            {/* Select all */}
                            <th style={{ padding: "10px 12px", width: 32, background: C.surfaceAlt, borderBottom: `2px solid ${C.border}` }}>
                                <input
                                    type="checkbox"
                                    checked={list.selectedIds.size > 0 && list.selectedIds.size === list.products.length}
                                    ref={el => { if (el) el.indeterminate = list.selectedIds.size > 0 && list.selectedIds.size < list.products.length; }}
                                    onChange={list.toggleSelectAll}
                                    style={{ accentColor: C.accent, width: 15, height: 15 }}
                                />
                            </th>
                            {/* Thumb col */}
                            <th style={{ width: 46, background: C.surfaceAlt, borderBottom: `2px solid ${C.border}` }} />
                            <ColHeader label="Name"       sortKey="name"  currentSort={list.sortBy} currentDir={list.sortDir} onSort={list.toggleSort} />
                            <ColHeader label="SKU"                        currentSort={list.sortBy} currentDir={list.sortDir} />
                            <ColHeader label="Stock"                      currentSort={list.sortBy} currentDir={list.sortDir} />
                            <ColHeader label="Price"      sortKey="price" currentSort={list.sortBy} currentDir={list.sortDir} onSort={list.toggleSort} />
                            <ColHeader label="Categories"                 currentSort={list.sortBy} currentDir={list.sortDir} />
                            <ColHeader label="Tags"                       currentSort={list.sortBy} currentDir={list.sortDir} />
                            <th style={{ padding: "10px 12px", width: 32, background: C.surfaceAlt, borderBottom: `2px solid ${C.border}` }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518" stroke="#f5c518" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            </th>
                            <ColHeader label="Date"       sortKey="date"  currentSort={list.sortBy} currentDir={list.sortDir} onSort={list.toggleSort} />
                        </tr>
                        </thead>

                        <tbody>
                        {list.isLoading ? (
                            <tr>
                                <td colSpan={10} style={{ padding: 40, textAlign: "center" as const, color: C.textMuted, fontSize: 14 }}>
                                    Loading…
                                </td>
                            </tr>
                        ) : list.products.length === 0 ? (
                            <tr>
                                <td colSpan={10} style={{ padding: 48, textAlign: "center" as const, color: C.textMuted, fontSize: 14 }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.textFaint} strokeWidth="1" style={{ display: "block", margin: "0 auto 12px" }}>
                                        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8L2 7h20l-6-4z"/>
                                    </svg>
                                    No products found.{" "}
                                    <button
                                        onClick={() => router.push("/admin/products/add")}
                                        style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}
                                    >
                                        Add your first product
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            list.products.map(p => (
                                <ProductRow
                                    key={p.id}
                                    product={p}
                                    selected={list.selectedIds.has(p.id)}
                                    onToggle={() => list.toggleSelect(p.id)}
                                    onDelete={() => list.deleteOne(p.id)}
                                    router={router}
                                />
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Bottom pagination */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
          <span style={{ fontSize: 12, color: C.textFaint }}>
            {list.total > 0 && `${list.total} item${list.total !== 1 ? "s" : ""}`}
          </span>
                    <Pagination page={list.params.page!} totalPages={list.totalPages} onPage={list.setPage} />
                </div>
            </div>

            {/* ── Selection bar (floating, when items selected) ────────────────────── */}
            {list.selectedIds.size > 0 && (
                <div style={{
                    position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
                    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
                    padding: "10px 20px", display: "flex", alignItems: "center", gap: 12,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4)", zIndex: 100,
                }}>
          <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>
            {list.selectedIds.size} selected
          </span>
                    <button onClick={() => { list.setBulkAction("publish"); list.applyBulkAction(); }} style={btnStyle()}>Publish</button>
                    <button onClick={() => { list.setBulkAction("draft"); list.applyBulkAction(); }} style={btnStyle()}>Draft</button>
                    <button onClick={() => { list.setBulkAction("delete"); list.applyBulkAction(); }} style={btnStyle("danger")}>Delete</button>
                    <button
                        onClick={() => list.toggleSelectAll()}
                        style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 18, padding: "0 4px", fontFamily: "inherit" }}
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}
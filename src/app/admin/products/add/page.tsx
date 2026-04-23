"use client";

import RichTextEditor from "@/src/modules/product/RichTextEditor";
import ProductDataPanel from "@/src/modules/product/ProductDataPanel";
import ProductPublishPanel from "@/src/modules/product/ProductPublishPanel";
import ProductImagesPanel from "@/src/modules/product/ProductImagePanel";
import { Product } from "@/src/lib/productApi";
import { useAddProduct, LOCALES, Locale } from "@/src/modules/product/useAddProduct";
import ProductCategoriesPanel from "@/src/modules/product/ProductSidePanel";
import ProductTagsPanel from "@/src/modules/product/ProductTags";
import ProductSlugField from "@/src/modules/product/ProductSlugField";

const C = {
    bg: "#1a1d1e",
    surface: "#22262a",
    surfaceAlt: "#1e2226",
    border: "#2e3338",
    text: "#e8eaed",
    textMuted: "#8b949e",
    textFaint: "#545d67",
    accent: "#2271b1",
    inputBg: "#161b1f",
    inputBorder: "#3d444d",
    danger: "#d63638",
};

// ── Shared locale tab bar ─────────────────────────────────────────────────────

interface LocaleTabsProps {
    active: Locale;
    onChange: (l: Locale) => void;
    filled: Record<Locale, string>;   // values to show green dot
    required?: Locale;                // locale that shows REQ badge
}

function LocaleTabs({ active, onChange, filled, required = "en" }: LocaleTabsProps) {
    return (
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, background: C.surfaceAlt }}>
            {LOCALES.map((loc) => (
                <button
                    key={loc.code}
                    onClick={() => onChange(loc.code)}
                    style={{
                        background: active === loc.code ? C.surface : "transparent",
                        border: "none",
                        borderBottom: active === loc.code ? `2px solid ${C.accent}` : "2px solid transparent",
                        color: active === loc.code ? C.text : C.textMuted,
                        fontSize: 12,
                        fontWeight: active === loc.code ? 700 : 400,
                        padding: "9px 16px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "all 0.12s",
                    }}
                >
                    <span style={{ fontSize: 14 }}>{loc.flag}</span>
                    {loc.label}
                    {loc.code === required && (
                        <span style={{
                            fontSize: 9,
                            background: C.accent,
                            color: "#fff",
                            borderRadius: 3,
                            padding: "1px 5px",
                            fontWeight: 700,
                        }}>
                            REQ
                        </span>
                    )}
                    {filled[loc.code] && (
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4caf50", flexShrink: 0 }} />
                    )}
                </button>
            ))}
        </div>
    );
}

// ── Section header (reused style) ─────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div style={{
            padding: "10px 16px",
            borderBottom: `1px solid ${C.border}`,
            background: C.surfaceAlt,
            fontSize: 12,
            fontWeight: 700,
            color: C.text,
            textTransform: "uppercase" as const,
            letterSpacing: "0.6px",
            display: "flex",
            alignItems: "center",
            gap: 8,
        }}>
            {title}
            {subtitle && (
                <span style={{ fontSize: 11, fontWeight: 400, color: C.textFaint, textTransform: "none" }}>
                    — {subtitle}
                </span>
            )}
        </div>
    );
}

// ── Locale fill indicator dots ────────────────────────────────────────────────

function FillDots({ values }: { values: Record<Locale, string> }) {
    return (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {LOCALES.map((loc) => (
                <div key={loc.code} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: values[loc.code] ? "#4caf50" : C.textFaint,
                    }} />
                    <span style={{ fontSize: 11, color: C.textFaint }}>{loc.label}</span>
                </div>
            ))}
        </div>
    );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
    existingProduct?: Product;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page({ existingProduct }: Props) {
    const hook = useAddProduct(existingProduct);
    const {
        form, setField, setLocaleField, errors,
        isSaving, saveStatus,
        activeTab, setActiveTab,
        tagInput, setTagInput, addTag, removeTag, handleTagKeyDown,
        addImages, removeImage, setFeaturedImage, reorderImages,
        saveDraft, publish, preview,
        isEditing,
        nameLocale,      setNameLocale,
        descLocale,      setDescLocale,
        shortDescLocale, setShortDescLocale,
    } = hook;

    return (
        <div style={{
            minHeight: "100vh",
            background: C.bg,
            color: C.text,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}>

            {/* ── Page header ── */}
            <div style={{
                borderBottom: `1px solid ${C.border}`,
                background: C.surface,
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                zIndex: 10,
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>
                        {isEditing ? "Edit Product" : "Add New Product"}
                    </h1>
                    {existingProduct && (
                        <span style={{ fontSize: 12, color: C.textMuted }}>
                            ID: {existingProduct.id} · Slug: /{existingProduct.slug}
                        </span>
                    )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        onClick={saveDraft}
                        disabled={isSaving}
                        style={{
                            background: C.surfaceAlt,
                            border: `1px solid ${C.inputBorder}`,
                            borderRadius: 4,
                            color: C.text,
                            fontSize: 13,
                            fontWeight: 600,
                            padding: "7px 14px",
                            cursor: isSaving ? "not-allowed" : "pointer",
                            fontFamily: "inherit",
                            opacity: isSaving ? 0.6 : 1,
                        }}
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={publish}
                        disabled={isSaving}
                        style={{
                            background: C.accent,
                            border: "none",
                            borderRadius: 4,
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 700,
                            padding: "7px 18px",
                            cursor: isSaving ? "not-allowed" : "pointer",
                            fontFamily: "inherit",
                            opacity: isSaving ? 0.7 : 1,
                        }}
                    >
                        {isEditing ? "Update" : "Publish"}
                    </button>
                </div>
            </div>

            {/* ── Main layout ── */}
            <div style={{
                maxWidth: 1280,
                margin: "0 auto",
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "1fr 300px",
                gap: 24,
                alignItems: "start",
            }}>

                {/* ── LEFT COLUMN ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* ── Product name — per locale ── */}
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                        <SectionHeader title="Product name" subtitle="per language" />
                        <LocaleTabs
                            active={nameLocale}
                            onChange={setNameLocale}
                            filled={form.name}
                        />
                        <div style={{ padding: 16 }}>
                            {LOCALES.map((loc) => (
                                <div key={loc.code} style={{ display: nameLocale === loc.code ? "block" : "none" }}>
                                    <input
                                        type="text"
                                        placeholder={`Product name in ${loc.label}${loc.code === "en" ? " (required)" : " (optional)"}`}
                                        value={form.name[loc.code]}
                                        onChange={(e) => setLocaleField("name", loc.code, e.target.value)}
                                        style={{
                                            width: "100%",
                                            background: C.inputBg,
                                            border: `1px solid ${loc.code === "en" && errors.name ? C.danger : C.inputBorder}`,
                                            borderRadius: 6,
                                            color: C.text,
                                            fontSize: 22,
                                            fontWeight: 600,
                                            padding: "12px 16px",
                                            fontFamily: "inherit",
                                            outline: "none",
                                            boxSizing: "border-box" as const,
                                        }}
                                    />
                                    {/* Slug preview only for English */}
                                    {loc.code === "en" && form.name.en && (
                                        <p style={{ margin: "8px 0 0", fontSize: 12, color: C.textFaint }}>
                                            Slug:{" "}
                                            <span style={{ color: C.textMuted }}>
                                                /products/{form.name.en.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            ))}
                            {errors.name && (
                                <p style={{ margin: "6px 0 0", fontSize: 12, color: C.danger }}>{errors.name}</p>
                            )}
                            <FillDots values={form.name} />
                        </div>
                    </div>

                    {/* ── Long description — per locale ── */}
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                        <SectionHeader title="Product description" subtitle="per language" />
                        <LocaleTabs
                            active={descLocale}
                            onChange={setDescLocale}
                            filled={form.description}
                        />
                        <div style={{ padding: 16 }}>
                            {LOCALES.map((loc) => (
                                <div key={loc.code} style={{ display: descLocale === loc.code ? "block" : "none" }}>
                                    <RichTextEditor
                                        value={form.description[loc.code]}
                                        onChange={(html) => setLocaleField("description", loc.code, html)}
                                        placeholder={`Write your product description in ${loc.label}…`}
                                        minHeight={200}
                                    />
                                </div>
                            ))}
                            <FillDots values={form.description} />
                        </div>
                    </div>

                    {/* ── Product data panel (no locale, unchanged) ── */}
                    <ProductDataPanel
                        form={form}
                        setField={setField}
                        errors={errors}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    {/* ── Short description — per locale ── */}
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                        <SectionHeader title="Short description" subtitle="shown in listings · per language" />
                        <LocaleTabs
                            active={shortDescLocale}
                            onChange={setShortDescLocale}
                            filled={form.shortDescription}
                        />
                        <div style={{ padding: 16 }}>
                            {LOCALES.map((loc) => (
                                <div key={loc.code} style={{ display: shortDescLocale === loc.code ? "block" : "none" }}>
                                    <RichTextEditor
                                        value={form.shortDescription[loc.code]}
                                        onChange={(html) => setLocaleField("shortDescription", loc.code, html)}
                                        placeholder={`Brief summary in ${loc.label}…`}
                                        minHeight={100}
                                    />
                                </div>
                            ))}
                            <FillDots values={form.shortDescription} />
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <ProductPublishPanel
                        form={form}
                        setField={setField}
                        isSaving={isSaving}
                        saveStatus={saveStatus}
                        isEditing={isEditing}
                        onSaveDraft={saveDraft}
                        onPublish={publish}
                        onPreview={preview}
                    />
                    <ProductImagesPanel
                        images={form.images}
                        onAdd={addImages}
                        onRemove={removeImage}
                        onSetFeatured={setFeaturedImage}
                        onReorder={reorderImages}
                    />
                    <ProductCategoriesPanel
                        categoryId={form.categoryId}
                        setField={setField}
                        error={errors.categoryId}
                    />
                    <ProductTagsPanel
                        tags={form.tags}
                        tagInput={tagInput}
                        setTagInput={setTagInput}
                        addTag={addTag}
                        removeTag={removeTag}
                        handleTagKeyDown={handleTagKeyDown}
                    />
                    <ProductSlugField slug={form.slug} setField={setField} error={errors.slug}/>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .product-layout { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
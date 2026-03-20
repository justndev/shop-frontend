"use client";



import RichTextEditor from "@/src/modules/product/RichTextEditor";
import ProductDataPanel from "@/src/modules/product/ProductDataPanel";
import ProductPublishPanel from "@/src/modules/product/ProductPublishPanel";
import ProductImagesPanel from "@/src/modules/product/ProductImagePanel";
import {ProductCategoriesPanel, ProductTagsPanel} from "@/src/modules/product/ProductSidePanel";
import {Product} from "@/src/api/productApi";
import {useAddProduct} from "@/src/modules/product/useAddProduct";

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

interface Props {
    existingProduct?: Product; // pass for edit mode
}

export default function Page({ existingProduct }: Props) {
    const hook = useAddProduct(existingProduct);
    const {
        form, setField, errors,
        isSaving, saveStatus,
        activeTab, setActiveTab,
        tagInput, setTagInput, addTag, removeTag, handleTagKeyDown,
        addImages, removeImage, setFeaturedImage, reorderImages,
        saveDraft, publish, preview,
        isEditing,
    } = hook;

    const inputStyle: React.CSSProperties = {
        width: "100%",
        background: C.inputBg,
        border: `1px solid ${errors.name ? C.danger : C.inputBorder}`,
        borderRadius: 6,
        color: C.text,
        fontSize: 22,
        fontWeight: 600,
        padding: "12px 16px",
        fontFamily: "inherit",
        outline: "none",
        boxSizing: "border-box" as const,
        transition: "border-color 0.15s",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: C.bg,
                color: C.text,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
        >
            {/* ── Page header ──────────────────────────────────────────────────────── */}
            <div
                style={{
                    borderBottom: `1px solid ${C.border}`,
                    background: C.surface,
                    padding: "16px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                }}
            >
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

                {/* Top-right quick save — visible on mobile too */}
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

            {/* ── Main layout ───────────────────────────────────────────────────────── */}
            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    padding: "24px",
                    display: "grid",
                    gridTemplateColumns: "1fr 300px",
                    gap: 24,
                    alignItems: "start",
                }}
            >
                {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Product name */}
                    <div
                        style={{
                            background: C.surface,
                            border: `1px solid ${C.border}`,
                            borderRadius: 8,
                            padding: "20px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Product name"
                            value={form.name}
                            onChange={(e) => setField("name", e.target.value)}
                            style={inputStyle}
                        />
                        {errors.name && (
                            <p style={{ margin: "6px 0 0", fontSize: 12, color: C.danger }}>{errors.name}</p>
                        )}
                        {/* Slug preview */}
                        {form.name && (
                            <p style={{ margin: "8px 0 0", fontSize: 12, color: C.textFaint }}>
                                Slug:{" "}
                                <span style={{ color: C.textMuted }}>
                  /products/{form.name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}
                </span>
                            </p>
                        )}
                    </div>

                    {/* Long description */}
                    <div
                        style={{
                            background: C.surface,
                            border: `1px solid ${C.border}`,
                            borderRadius: 8,
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                padding: "10px 16px",
                                borderBottom: `1px solid ${C.border}`,
                                background: C.surfaceAlt,
                                fontSize: 12,
                                fontWeight: 700,
                                color: C.text,
                                textTransform: "uppercase" as const,
                                letterSpacing: "0.6px",
                            }}
                        >
                            Product description
                        </div>
                        <div style={{ padding: 16 }}>
                            <RichTextEditor
                                value={form.description}
                                onChange={(html) => setField("description", html)}
                                placeholder="Write your product description…"
                                minHeight={200}
                            />
                        </div>
                    </div>

                    {/* Product data panel */}
                    <ProductDataPanel
                        form={form}
                        setField={setField}
                        errors={errors}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    {/* Short description */}
                    <div
                        style={{
                            background: C.surface,
                            border: `1px solid ${C.border}`,
                            borderRadius: 8,
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
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
                            }}
                        >
                            Product short description
                            <span style={{ fontSize: 11, fontWeight: 400, color: C.textFaint, textTransform: "none" }}>
                — shown in listings and search results
              </span>
                        </div>
                        <div style={{ padding: 16 }}>
                            <RichTextEditor
                                value={form.shortDescription}
                                onChange={(html) => setField("shortDescription", html)}
                                placeholder="Brief summary of the product…"
                                minHeight={100}
                            />
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN ────────────────────────────────────────────────── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Publish panel */}
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

                    {/* Images */}
                    <ProductImagesPanel
                        images={form.images}
                        onAdd={addImages}
                        onRemove={removeImage}
                        onSetFeatured={setFeaturedImage}
                        onReorder={reorderImages}
                    />

                    {/* Categories */}
                    <ProductCategoriesPanel
                        categoryId={form.categoryId}
                        setField={setField}
                        error={errors.categoryId}
                    />

                    {/* Tags */}
                    <ProductTagsPanel
                        tags={form.tags}
                        tagInput={tagInput}
                        setTagInput={setTagInput}
                        addTag={addTag}
                        removeTag={removeTag}
                        handleTagKeyDown={handleTagKeyDown}
                    />
                </div>
            </div>

            {/* ── Responsive styles ─────────────────────────────────────────────── */}
            <style>{`
        @media (max-width: 900px) {
          .product-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}
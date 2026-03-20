"use client";


import {ActiveTab, FormErrors, ProductFormState} from "@/src/modules/product/useAddProduct";

const C = {
    surface: "#22262a",
    surfaceAlt: "#1e2226",
    border: "#2e3338",
    text: "#e8eaed",
    textMuted: "#8b949e",
    textFaint: "#545d67",
    accent: "#2271b1",
    accentLight: "rgba(34,113,177,0.15)",
    inputBg: "#161b1f",
    inputBorder: "#3d444d",
    danger: "#d63638",
    dangerLight: "rgba(214,54,56,0.12)",
};

interface Props {
    form: ProductFormState;
    setField: <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => void;
    errors: FormErrors;
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

const TABS: { id: ActiveTab; label: string; icon: string }[] = [
    { id: "general",   label: "General",   icon: "⚙" },
    { id: "inventory", label: "Inventory", icon: "📦" },
    { id: "advanced",  label: "Advanced",  icon: "🔧" },
];

// ── Shared field components ────────────────────────────────────────────────────

function FieldRow({
                      label,
                      hint,
                      error,
                      children,
                  }: {
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}` }}>
            {/* Label column */}
            <div
                style={{
                    width: 180,
                    flexShrink: 0,
                    padding: "14px 16px 14px 20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    borderRight: `1px solid ${C.border}`,
                    background: C.surfaceAlt,
                }}
            >
                <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{label}</label>
                {hint && <span style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>{hint}</span>}
            </div>
            {/* Input column */}
            <div
                style={{
                    flex: 1,
                    padding: "12px 16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 4,
                }}
            >
                {children}
                {error && <span style={{ fontSize: 11, color: C.danger }}>{error}</span>}
            </div>
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    background: C.inputBg,
    border: `1px solid ${C.inputBorder}`,
    borderRadius: 4,
    color: C.text,
    fontSize: 13,
    padding: "7px 10px",
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
    maxWidth: 320,
};

const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238b949e'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: 28,
    cursor: "pointer",
};

// ── TABS ──────────────────────────────────────────────────────────────────────

function GeneralTab({
                        form,
                        setField,
                        errors,
                    }: {
    form: ProductFormState;
    setField: Props["setField"];
    errors: FormErrors;
}) {
    return (
        <div>
            <FieldRow label="Regular price (€)" error={errors.price}>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setField("price", e.target.value)}
                    placeholder="0.00"
                    style={{ ...inputStyle, borderColor: errors.price ? C.danger : C.inputBorder }}
                />
            </FieldRow>

            <FieldRow label="Sale price (€)" hint="Leave blank for no sale">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.salePrice}
                        onChange={(e) => setField("salePrice", e.target.value)}
                        placeholder="0.00"
                        style={inputStyle}
                    />
                    {form.salePrice && Number(form.salePrice) > 0 && (
                        <span style={{ fontSize: 11, color: "#4caf50", whiteSpace: "nowrap" }}>
              {Math.round((1 - Number(form.salePrice) / Number(form.price)) * 100)}% off
            </span>
                    )}
                </div>
                {errors.salePrice && <span style={{ fontSize: 11, color: C.danger }}>{errors.salePrice}</span>}
            </FieldRow>
        </div>
    );
}

function InventoryTab({
                          form,
                          setField,
                          errors,
                      }: {
    form: ProductFormState;
    setField: Props["setField"];
    errors: FormErrors;
}) {
    return (
        <div>
            <FieldRow label="SKU" hint="Stock keeping unit" error={errors.sku}>
                <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setField("sku", e.target.value)}
                    placeholder="e.g. BP-4501-OEM"
                    style={{ ...inputStyle, borderColor: errors.sku ? C.danger : C.inputBorder }}
                />
            </FieldRow>

            <FieldRow label="Stock status">
                <select
                    value={form.stockStatus}
                    onChange={(e) => setField("stockStatus", e.target.value as ProductFormState["stockStatus"])}
                    style={selectStyle}
                >
                    <option value="IN_STOCK">In stock</option>
                    <option value="OUT_OF_STOCK">Out of stock</option>
                    <option value="ON_BACKORDER">On backorder</option>
                </select>
            </FieldRow>

            <FieldRow label="Stock quantity" hint="0 = unlimited" error={errors.stock}>
                <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) => setField("stock", e.target.value)}
                    style={{ ...inputStyle, borderColor: errors.stock ? C.danger : C.inputBorder }}
                />
            </FieldRow>
        </div>
    );
}

function AdvancedTab({
                         form,
                         setField,
                     }: {
    form: ProductFormState;
    setField: Props["setField"];
}) {
    return (
        <div>
            <FieldRow label="Purchase note" hint="Optional note sent after purchase">
        <textarea
            value={form.purchaseNote}
            onChange={(e) => setField("purchaseNote", e.target.value)}
            rows={3}
            placeholder="Thank you for your purchase…"
            style={{ ...inputStyle, maxWidth: "100%", resize: "vertical" as const }}
        />
            </FieldRow>

            <FieldRow label="Menu order" hint="Custom ordering position">
                <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.menuOrder}
                    onChange={(e) => setField("menuOrder", e.target.value)}
                    style={inputStyle}
                />
            </FieldRow>

            <FieldRow label="Enable reviews">
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        checked={form.reviewsEnabled}
                        onChange={(e) => setField("reviewsEnabled", e.target.checked)}
                        style={{ accentColor: C.accent, width: 16, height: 16 }}
                    />
                    <span style={{ fontSize: 13, color: C.text }}>Allow customers to review this product</span>
                </label>
            </FieldRow>
        </div>
    );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function ProductDataPanel({ form, setField, errors, activeTab, setActiveTab }: Props) {
    return (
        <div
            style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "12px 16px",
                    background: C.surfaceAlt,
                    borderBottom: `1px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                }}
            >
        <span style={{ fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.6px" }}>
          Product data
        </span>
                <span style={{ color: C.textFaint, fontSize: 12 }}>—</span>
                <span style={{ fontSize: 12, color: C.textMuted }}>Simple product</span>
            </div>

            <div style={{ display: "flex", minHeight: 260 }}>
                {/* Sidebar tabs */}
                <div
                    style={{
                        width: 160,
                        flexShrink: 0,
                        borderRight: `1px solid ${C.border}`,
                        background: C.surfaceAlt,
                    }}
                >
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                width: "100%",
                                background: activeTab === tab.id ? C.accentLight : "transparent",
                                border: "none",
                                borderLeft: activeTab === tab.id ? `3px solid ${C.accent}` : "3px solid transparent",
                                color: activeTab === tab.id ? C.text : C.textMuted,
                                fontSize: 13,
                                fontWeight: activeTab === tab.id ? 600 : 400,
                                padding: "11px 14px 11px 13px",
                                textAlign: "left" as const,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                transition: "all 0.12s",
                            }}
                        >
                            <span style={{ fontSize: 14 }}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div style={{ flex: 1, overflow: "hidden" }}>
                    {activeTab === "general"   && <GeneralTab   form={form} setField={setField} errors={errors} />}
                    {activeTab === "inventory" && <InventoryTab form={form} setField={setField} errors={errors} />}
                    {activeTab === "advanced"  && <AdvancedTab  form={form} setField={setField} />}
                </div>
            </div>
        </div>
    );
}
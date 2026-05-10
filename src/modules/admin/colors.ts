/**
 * Admin panel design tokens.
 *
 * All actual values live in globals.css as --admin-* CSS custom properties.
 * This file exposes the var() references so TypeScript code (e.g. canvas /
 * chart configs) can consume them without duplicating raw hex values.
 *
 * In Tailwind components prefer the inline form:
 *   bg-[var(--admin-surface)]   text-[var(--admin-text)]   etc.
 */

const ADMIN_PANEL_COLORS = {
    bg:            "var(--admin-bg)",
    surface:       "var(--admin-surface)",
    surfaceAlt:    "var(--admin-surface-alt)",
    surfaceHover:  "var(--admin-surface-hover)",
    border:        "var(--admin-border)",
    text:          "var(--admin-text)",
    textMuted:     "var(--admin-text-muted)",
    textFaint:     "var(--admin-text-faint)",
    accent:        "var(--admin-accent)",
    accentHover:   "var(--admin-accent-hover)",
    accentLight:   "var(--admin-accent-light)",
    success:       "var(--admin-success)",
    successBg:     "var(--admin-success-bg)",
    warning:       "var(--admin-warning)",
    warningBg:     "var(--admin-warning-bg)",
    danger:        "var(--admin-danger)",
    dangerBg:      "var(--admin-danger-bg)",
    inputBg:       "var(--admin-input-bg)",
    inputBorder:   "var(--admin-input-border)",
} as const;

export default ADMIN_PANEL_COLORS;
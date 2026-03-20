"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const C = {
    bg: "#1a1d1e",
    surface: "#22262a",
    border: "#2e3338",
    text: "#e8eaed",
    textMuted: "#8b949e",
    inputBg: "#161b1f",
    inputBorder: "#3d444d",
    accent: "#2271b1",
    toolbarBg: "#1e2226",
};

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: number;
}

type ToolbarBtn = {
    label: string;
    icon: React.ReactNode;
    action: (editor: any) => void;
    isActive?: (editor: any) => boolean;
};

const TOOLBAR_GROUPS: ToolbarBtn[][] = [
    [
        {
            label: "Bold",
            icon: <strong style={{ fontSize: 13 }}>B</strong>,
            action: (e) => e.chain().focus().toggleBold().run(),
            isActive: (e) => e.isActive("bold"),
        },
        {
            label: "Italic",
            icon: <em style={{ fontSize: 13 }}>I</em>,
            action: (e) => e.chain().focus().toggleItalic().run(),
            isActive: (e) => e.isActive("italic"),
        },
        {
            label: "Strike",
            icon: <s style={{ fontSize: 13 }}>S</s>,
            action: (e) => e.chain().focus().toggleStrike().run(),
            isActive: (e) => e.isActive("strike"),
        },
    ],
    [
        {
            label: "H2",
            icon: <span style={{ fontSize: 11, fontWeight: 700 }}>H2</span>,
            action: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: (e) => e.isActive("heading", { level: 2 }),
        },
        {
            label: "H3",
            icon: <span style={{ fontSize: 11, fontWeight: 700 }}>H3</span>,
            action: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: (e) => e.isActive("heading", { level: 3 }),
        },
    ],
    [
        {
            label: "Bullet list",
            icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <circle cx="1.5" cy="3" r="1.5" /><rect x="4" y="2" width="10" height="2" rx="1" />
                    <circle cx="1.5" cy="7" r="1.5" /><rect x="4" y="6" width="10" height="2" rx="1" />
                    <circle cx="1.5" cy="11" r="1.5" /><rect x="4" y="10" width="10" height="2" rx="1" />
                </svg>
            ),
            action: (e) => e.chain().focus().toggleBulletList().run(),
            isActive: (e) => e.isActive("bulletList"),
        },
        {
            label: "Ordered list",
            icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <text x="0" y="4" style={{ fontSize: "5px" }}>1.</text>
                    <rect x="4" y="2" width="10" height="2" rx="1" />
                    <text x="0" y="9" style={{ fontSize: "5px" }}>2.</text>
                    <rect x="4" y="6" width="10" height="2" rx="1" />
                    <text x="0" y="13" style={{ fontSize: "5px" }}>3.</text>
                    <rect x="4" y="10" width="10" height="2" rx="1" />
                </svg>
            ),
            action: (e) => e.chain().focus().toggleOrderedList().run(),
            isActive: (e) => e.isActive("orderedList"),
        },
        {
            label: "Blockquote",
            icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <rect x="0" y="0" width="2" height="14" rx="1" />
                    <rect x="4" y="2" width="10" height="2" rx="1" opacity="0.6" />
                    <rect x="4" y="6" width="8" height="2" rx="1" opacity="0.6" />
                    <rect x="4" y="10" width="9" height="2" rx="1" opacity="0.6" />
                </svg>
            ),
            action: (e) => e.chain().focus().toggleBlockquote().run(),
            isActive: (e) => e.isActive("blockquote"),
        },
    ],
    [
        {
            label: "Undo",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 14 4 9 9 4" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" />
                </svg>
            ),
            action: (e) => e.chain().focus().undo().run(),
        },
        {
            label: "Redo",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 14 20 9 15 4" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" />
                </svg>
            ),
            action: (e) => e.chain().focus().redo().run(),
        },
    ],
];

export default function RichTextEditor({
                                           value,
                                           onChange,
                                           placeholder = "Write something…",
                                           minHeight = 160,
                                       }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                style: `min-height:${minHeight}px; padding: 12px; outline: none; color: ${C.text}; font-size: 13px; line-height: 1.6;`,
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    // Sync external value changes (e.g. when loading existing product)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, false);
        }
    }, [value, editor]);

    const btnStyle = (active: boolean): React.CSSProperties => ({
        background: active ? C.accent : "transparent",
        border: "none",
        borderRadius: 3,
        color: active ? "#fff" : C.textMuted,
        cursor: "pointer",
        padding: "4px 7px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 28,
        height: 26,
        transition: "all 0.12s",
    });

    return (
        <div
            style={{
                border: `1px solid ${C.inputBorder}`,
                borderRadius: 6,
                overflow: "hidden",
                background: C.inputBg,
            }}
        >
            {/* Toolbar */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    padding: "6px 8px",
                    background: C.toolbarBg,
                    borderBottom: `1px solid ${C.border}`,
                    flexWrap: "wrap",
                }}
            >
                {TOOLBAR_GROUPS.map((group, gi) => (
                    <div key={gi} style={{ display: "flex", gap: 1, paddingRight: gi < TOOLBAR_GROUPS.length - 1 ? 6 : 0, marginRight: gi < TOOLBAR_GROUPS.length - 1 ? 6 : 0, borderRight: gi < TOOLBAR_GROUPS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                        {group.map((btn) => (
                            <button
                                key={btn.label}
                                type="button"
                                title={btn.label}
                                onClick={() => editor && btn.action(editor)}
                                style={btnStyle(!!editor && !!btn.isActive && btn.isActive(editor))}
                                onMouseOver={(e) => { if (!editor || !btn.isActive || !btn.isActive(editor)) e.currentTarget.style.background = "#2a3038"; }}
                                onMouseOut={(e) => { if (!editor || !btn.isActive || !btn.isActive(editor)) e.currentTarget.style.background = "transparent"; }}
                            >
                                {btn.icon}
                            </button>
                        ))}
                    </div>
                ))}
            </div>

            {/* Editor area */}
            <div style={{ position: "relative" }}>
                {editor && editor.isEmpty && (
                    <div
                        style={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            color: C.textMuted,
                            fontSize: 13,
                            pointerEvents: "none",
                            userSelect: "none",
                        }}
                    >
                        {placeholder}
                    </div>
                )}
                <EditorContent editor={editor} />
            </div>

            <style>{`
        .ProseMirror h2 { font-size: 1.3em; font-weight: 700; margin: 0.6em 0 0.3em; color: ${C.text}; }
        .ProseMirror h3 { font-size: 1.1em; font-weight: 600; margin: 0.5em 0 0.2em; color: ${C.text}; }
        .ProseMirror p { margin: 0.3em 0; }
        .ProseMirror ul, .ProseMirror ol { padding-left: 1.4em; margin: 0.3em 0; }
        .ProseMirror blockquote { border-left: 3px solid ${C.accent}; margin: 0.5em 0; padding-left: 12px; color: ${C.textMuted}; }
        .ProseMirror strong { color: ${C.text}; }
        .ProseMirror:focus { outline: none; }
      `}</style>
        </div>
    );
}
// src/app/admin/tag/[id]/edit/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import TagsFormPage from "@/src/modules/tag/TagsFormPage";
import {Tag} from "@/src/utils/types";
import tagApi from "@/src/modules/tag/tagApi";

export default function EditTagsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [tag, setTag] = useState<Tag | null>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchTag() {
            const responseData = await tagApi.getById(id)
            setTag(responseData.data)
        }
        fetchTag();
    }, [id]);

    if (notFound) return (
        <div style={{ padding: 40, textAlign: "center", color: "#8b949e" }}>Tag not found.</div>
    );
    if (!tag) return (
        <div style={{ padding: 40, textAlign: "center", color: "#8b949e" }}>Loading…</div>
    );

    return <TagsFormPage existingTag={tag} />;
}
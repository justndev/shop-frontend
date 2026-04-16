// src/app/admin/categories/[id]/edit/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import CategoryFormPage from "@/src/modules/category/CategoryFormPage";
import categoryApi from "@/src/api/categoryApi";
import {Category} from "@/src/types";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [category, setCategory] = useState<Category | null>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchCategory() {
            const responseData = await categoryApi.getById(id)
            setCategory(responseData.data)
        }
        fetchCategory();
    }, [id]);

    if (notFound) return (
        <div style={{ padding: 40, textAlign: "center", color: "#8b949e" }}>Category not found.</div>
    );
    if (!category) return (
        <div style={{ padding: 40, textAlign: "center", color: "#8b949e" }}>Loading…</div>
    );

    return <CategoryFormPage existingCategory={category} />;
}
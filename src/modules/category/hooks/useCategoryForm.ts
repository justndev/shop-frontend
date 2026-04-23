// src/modules/category/useCategory.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import categoryApi, {CreateCategoryPayload} from "@/src/modules/category/categoryApi";
import {categoryToForm, toSlug} from "@/src/utils/functions";
import {Category, Locale} from "@/src/utils/types";


export interface CategoryFormState {
    name: Record<Locale, string>;
    slug: string;
    image: string;
}

export interface CategoryFormErrors {
    name?: string;
    slug?: string;
}

export default function useCategoryForm(existing?: Category) {
    const router = useRouter();
    const isEditing = !!existing;

    const [form, setForm] = useState<CategoryFormState>(
        existing ? categoryToForm(existing) : { name: { en: "", ru: "", et: "" }, slug: "", image: "" }
    );
    const [errors, setErrors] = useState<CategoryFormErrors>({});
    const [activeLocale, setActiveLocale] = useState<Locale>("en");
    const [slugLocked, setSlugLocked] = useState(isEditing);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

    // Sync if existing prop changes (e.g. data fetched after mount)
    useEffect(() => {
        if (existing) {
            setForm(categoryToForm(existing));
            setSlugLocked(true);
        }
    }, [existing?.id]);

    async function handleSubmit() {
        if (!validate()) return;
        setSaveStatus("saving");
        try {
            const payload: CreateCategoryPayload = {
                name: form.name,
                slug: form.slug,
                image: form.image || undefined,
            };
            if (isEditing && existing) {
                await categoryApi.update(existing.id, payload);
            } else {
                await categoryApi.create(payload);
            }
            setSaveStatus("saved");
            setTimeout(() => router.push("/admin/categories"), 800);
        } catch {
            setSaveStatus("error");
        }
    }

    function setName(locale: Locale, value: string) {
        setForm((prev) => {
            const next = { ...prev, name: { ...prev.name, [locale]: value } };
            if (locale === "en" && !slugLocked) next.slug = toSlug(value);
            return next;
        });
        if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
    }

    function setSlug(value: string) {
        setSlugLocked(true);
        setForm((prev) => ({ ...prev, slug: toSlug(value) }));
        if (errors.slug) setErrors((e) => ({ ...e, slug: undefined }));
    }

    function setImage(url: string) {
        setForm((prev) => ({ ...prev, image: url }));
    }

    function validate(): boolean {
        const errs: CategoryFormErrors = {};
        if (!form.name.en.trim()) errs.name = "English name is required";
        if (!form.slug.trim()) errs.slug = "Slug is required";
        else if (!/^[a-z0-9-]+$/.test(form.slug)) errs.slug = "Only lowercase letters, numbers, and hyphens";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    return {
        form, errors, activeLocale, setActiveLocale,
        setName, setSlug, setImage,
        saveStatus, handleSubmit, isEditing, slugLocked,
    };
}

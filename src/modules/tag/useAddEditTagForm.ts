// src/hooks/tag/useTagsForm.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {TranslatedStrings, Locale, Tag} from "@/src/utils/types";
import tagApi, {CreateTagPayload} from "@/src/modules/tag/tagApi";


export const LOCALES: { code: Locale; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ru", label: "Russian", flag: "🇷🇺" },
    { code: "et", label: "Estonian", flag: "🇪🇪" },
];

export interface TagFormState {
    name?: TranslatedStrings;
}

export interface TagFormErrors {
    name?: string;
}

function tagToForm(tag: Tag): TagFormState {
    return {
        name: {
            en: (tag.name as any).en ?? "",
            ru: (tag.name as any).ru ?? "",
            et: (tag.name as any).et ?? "",
        }
    };
}

export default function useAddEditTagForm(existing?: Tag) {
    const router = useRouter();
    const isEditing = !!existing;

    const [form, setForm] = useState<TagFormState>(
        existing ? tagToForm(existing) : { name: { en: "", ru: "", et: "" } }
    );
    const [errors, setErrors] = useState<TagFormErrors>({});
    const [activeLocale, setActiveLocale] = useState<Locale>("en");
    const [slugLocked, setSlugLocked] = useState(isEditing);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

    // Sync if existing prop changes (e.g. data fetched after mount)
    useEffect(() => {
        if (existing) {
            setForm(tagToForm(existing));
            setSlugLocked(true);
        }
    }, [existing?.id]);

    function setName(locale: Locale, value: string) {
        setForm((prev) => {
            const next = { ...prev, name: { ...prev.name, [locale]: value } };
            return next;
        });
        if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
    }

    function validate(): boolean {
        const errs: TagFormState = {};
        if (!form.name.en.trim()) errs.name = "English name is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) return;
        setSaveStatus("saving");
        try {
            const payload: CreateTagPayload = {
                name: form.name,
            };
            if (isEditing && existing) {
                await tagApi.update(existing.id, payload);
            } else {
                await tagApi.create(payload);
            }
            setSaveStatus("saved");
            setTimeout(() => router.push("/admin/tags"), 800);
        } catch {
            setSaveStatus("error");
        }
    }

    return {
        form, errors, activeLocale, setActiveLocale,
        setName,
        saveStatus, handleSubmit, isEditing, slugLocked,
    };
}
import {Category} from "@/src/utils/types";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {CategoryFormErrors, CategoryFormState} from "@/src/modules/category/hooks/useCategoryForm";

export function getThumbnailUrl(url: string) {
    return url
        .replace('/uploads/', '/thumbs/')
        .replace(/\.[^/.]+$/, '.jpg');
}

export function cutTitle(title: string, maxLength = 50): string {
    if (title.length <= maxLength) return title;

    const lastSpace = title.lastIndexOf(' ', maxLength);

    if (lastSpace === -1) return title;

    return title.substring(0, lastSpace);
}

export function slugFromPath(pathname: string) {
    return pathname.split("/").pop();
}

export function toSlug(str: string) {
    return str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export function categoryToForm(cat: Category): CategoryFormState {
    return {
        name: {
            en: (cat.name as any).en ?? "",
            ru: (cat.name as any).ru ?? "",
            et: (cat.name as any).et ?? "",
        },
        slug: cat.slug,
        image: cat.image ?? "",
    };
}
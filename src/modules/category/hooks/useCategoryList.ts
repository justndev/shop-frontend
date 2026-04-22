// src/modules/category/useCategoryList.ts
import { useState, useEffect, useCallback } from "react";
import categoryApi from "@/src/modules/category/categoryApi";
import {Alert, AlertType, Category} from "@/src/types";
import {AxiosError} from "axios";

export function useCategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryAlert, setCategoryAlert] = useState<Alert | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setCategoryAlert(null)

        try {
            const responseData = await categoryApi.getAll();
            setCategories(responseData.data);
        } catch (error: AxiosError) {
            const message =  error.response?.data?.details || 'Failed to fetch categories';
            setCategoryAlert({type: 'error', message});
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    async function handleDelete(id: string) {
        setShowDeleteDialog(true);
        setCategoryAlert(null)
    }

    async function handleDeleteConfirm(id: string) {
        setCategoryAlert(null);

        try {
            await categoryApi.delete(id);
            setCategories((prev) => prev.filter((c) => c.id !== id));
        } catch (error: AxiosError) {
            const message =  error.response?.data?.details || 'Failed to delete category';
            setCategoryAlert({type: 'error', message});
        }
    }

    return {
        categories,
        loading,
        categoryAlert,
        handleDelete,
        load,
    };
}
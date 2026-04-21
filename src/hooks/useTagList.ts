// src/modules/tag/usetagList.ts
import { useState, useEffect, useCallback } from "react";
import tagApi from "@/src/api/tagApi";
import {Alert, AlertType, Tag} from "@/src/utils/types";
import {AxiosError} from "axios";

export function useTagList() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [tagAlert, settagAlert] = useState<Alert | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        settagAlert(null)

        try {
            const responseData = await tagApi.getAll();
            setTags(responseData.data);
        } catch (error: AxiosError) {
            const message =  error.response?.data?.details || 'Failed to fetch categories';
            settagAlert({type: 'error', message});
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);


    async function handleDelete(id: string) {
        settagAlert(null);

        try {
            await tagApi.delete(id);
            setTags((prev) => prev.filter((c) => c.id !== id));
        } catch (error: AxiosError) {
            const message =  error.response?.data?.details || 'Failed to delete tag';
            settagAlert({type: 'error', message});
        }
    }

    return {
        tags,
        loading,
        tagAlert,
        handleDelete,
        load,
    };
}
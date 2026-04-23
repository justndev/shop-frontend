'use client';

import { Checkbox, FormControlLabel, MenuItem, Select, Typography } from "@mui/material";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {useTranslation} from "react-i18next";


const SORT_OPTIONS = ["new", "cheap", "expensive"];

export default function FiltersBar() {
    const {t} = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const sort = searchParams.get("sort") ?? "new";
    const inStock = searchParams.get("inStock") === "true";

    const updateParam = useCallback(
        (key: string, value: string | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === null || value === "new" || value === "false") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [router, pathname, searchParams]
    );


    return (
        // <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginBottom: 20 }}>
            <div className='flex items-center justify-end gap-2 mb-8'>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={inStock}
                        onChange={e => updateParam("inStock", String(e.target.checked))}
                        size="small"
                        sx={{ color: '#1a3c2e', '&.Mui-checked': { color: '#1a3c2e' } }}
                    />
                }
                label={<Typography sx={{ fontSize: '0.85rem', color: '#4a4a42' }}>In stock</Typography>}
            />
            <Select
                value={sort}
                onChange={e => updateParam("sort", e.target.value)}
                size="small"
                sx={{
                    width: 190,
                    fontSize: '0.85rem',
                    background: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0ddd6' },
                }}
            >
                {SORT_OPTIONS.map(opt => (
                    <MenuItem key={opt} value={opt} sx={{ fontSize: '0.85rem' }}>
                        {t(`catalog.options.${opt}`)}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
}
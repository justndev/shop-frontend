'use client';

import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ru', label: 'Russian', flag: '🇷🇺' },
    { code: 'et', label: 'Estonian', flag: '🇪🇪' },
];

export default function LanguageDropdown() {
    const { i18n } = useTranslation();
    const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];

    const handleChange = (e: SelectChangeEvent) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <Select
            value={current.code}
            onChange={handleChange}
            variant="standard"
            disableUnderline
            renderValue={(value) => {
                const lang = LANGUAGES.find(l => l.code === value)!;
                return (
                    <span className="flex items-center gap-1.5 text-[rgba(255,255,255,0.95)] text-sm font-semibold uppercase tracking-wider">
<span className='text-xl'>{lang.flag}</span>  {/* was font-xl → text-xl */}
                        {/* Label hidden on mobile, visible md+ */}
                        <span className="hidden md:inline text-sm">{lang.label}</span>
                    </span>
                );
            }}
            sx={{
                color: 'white',
                '& .MuiSelect-icon': { color: '#ffffff' },
                '& .MuiSelect-select': {
                    padding: '4px 24px 4px 4px',
                    background: 'transparent !important',
                    display: 'flex',
                    alignItems: 'center',
                },
                '&:before, &:after': { display: 'none' },
                background: 'transparent',
                minWidth: 0,
            }}
            MenuProps={{
                PaperProps: {
                    sx: {
                        mt: 1,
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        '& .MuiMenuItem-root': {
                            color: '#1a202c',
                            gap: 1.5,
                            fontSize: 14,
                            '&:hover': { background: '#f7fafc' },
                            '&.Mui-selected': { background: '#edf2f7' },
                            '&.Mui-selected:hover': { background: '#e2e8f0' },
                        },
                    },
                },
            }}
        >
            {LANGUAGES.map(({ code, flag, label }) => (
                <MenuItem key={code} value={code}>
                    <span className='text-xl'>{flag}</span>  {/* was font-xl → text-xl */}
                    <span className='uppercase font-semibold '>{label}</span>
                </MenuItem>
            ))}
        </Select>
    );
}
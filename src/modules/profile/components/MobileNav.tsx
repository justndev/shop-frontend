'use client';

import {Tabs, Tab, Box} from "@mui/material";
import {useTranslation} from "react-i18next";
import AccountHeader from "@/src/modules/profile/components/AccountHeader";
import {User} from "@/src/utils/types";

interface MobileNavProps {
    user: User;
    tabs: { id: string; label: string; icon: React.ReactNode }[];
    activeTab: string;
    handleTabChange: (_: React.SyntheticEvent, newValue: number) => void;
    showLogoutDialog: () => void;
}

export default function MobileNav({user, tabs, activeTab, handleTabChange, showLogoutDialog}: MobileNavProps) {
    const {t} = useTranslation();

    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

    function handleChange(_: React.SyntheticEvent, newIndex: number) {
        if (tabs[newIndex].id === 'logout') {
            showLogoutDialog();
            return; // don't call handleTabChange — keep current tab active
        }
        handleTabChange(_, newIndex);
    }

    return (
        <nav className="flex flex-col items-start w-full gap-2">
            <AccountHeader user={user!}/>

            <Box className='w-full bg-white rounded-xl shadow-lg overflow-hidden'>
                <Tabs
                    value={activeIndex}
                    onChange={handleChange}
                    variant="fullWidth"
                    aria-label="account navigation"
                    TabIndicatorProps={{
                        style: {
                            backgroundColor: 'var(--green-pale)',
                            height: 3,
                            borderRadius: '3px 3px 0 0',
                            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                        },
                    }}

                >
                    {tabs.map((tab, i) => {
                        return (
                            <Tab
                                key={tab.id}
                                icon={tab.icon}
                                iconPosition="start"
                                label={t(tab.label)}
                                sx={{
                                    minHeight: 48,
                                    flex: 1,
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.05em',
                                    gap: '6px',
                                    color: false ? '#ffffff' : '#1a3c2e',
                                    backgroundColor: false ? '#1a3c2e' : 'transparent',
                                    transition: 'background-color 0.2s ease, color 0.2s ease',
                                    whiteSpace: 'nowrap',
                                    '&:hover:not(.Mui-selected)': {
                                        backgroundColor: 'rgba(26, 60, 46, 0.06)',
                                        color: '#1a3c2e',
                                    },
                                    '&.Mui-focusVisible': {
                                        outline: '2px solid #1a3c2e',
                                        outlineOffset: -2,
                                    },
                                }}
                            />
                        );
                    })}
                </Tabs>
            </Box>
        </nav>
    );
}

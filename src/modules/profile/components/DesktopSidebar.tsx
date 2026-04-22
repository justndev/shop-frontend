import {useTranslation} from "react-i18next";
import AccountHeader from "@/src/modules/profile/components/AccountHeader";
import {User} from "@/src/utils/types";
import {Button} from "@mui/material";

interface DesktopSidebarProps {
    user: User;
    TABS: { id: string; label: string; icon: React.ReactNode }[],
    activeTab: string,
    setActiveTab: (activeTab: Tab) => void,
    showLogoutDialog: () => void
}

export default function DesktopSidebar({user, TABS, activeTab, setActiveTab, showLogoutDialog}: DesktopSidebarProps) {
    const {t} = useTranslation();

    function handleClick(tabId: string) {
        if (tabId !== 'logout') setActiveTab(tabId);
        else showLogoutDialog();
    }

    return (
        <aside className="flex flex-col gap-4 mr-4" style={{width: 260, flexShrink: 0}}>
            <AccountHeader user={user!}/>
            <div className="flex flex-col gap-2">
                {TABS.map(tab => {
                    const active = activeTab === tab.id;

                    return (
                        <Button
                            variant={'contained'}
                            key={tab.id}
                            onClick={() => handleClick(tab.id)}
                            startIcon={tab.icon}
                            disableRipple={false}
                            sx={{
                                justifyContent: 'flex-start',
                                gap: '10px',
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '0.95rem',
                                fontWeight: active ? 600 : 400,
                                color: active ? '#ffffff' : '#1a3c2e',
                                backgroundColor: active ? '#1a3c2e' : '#ffffff',
                                textAlign: 'left',
                                textTransform: 'none',
                                transition: 'background-color 0.15s, box-shadow 0.15s',
                                borderRadius: active ? '4px 20px 20px 4px' : '8px',
                                boxShadow: active
                                    ? '2px 2px 8px rgba(26, 60, 46, 0.25)'
                                    : '0 1px 3px rgba(0,0,0,0.06)',
                                '&:hover': {
                                    backgroundColor: active ? '#1a3c2e' : '#f0f4f2',
                                    boxShadow: active
                                        ? '2px 2px 8px rgba(26, 60, 46, 0.25)'
                                        : '0 1px 3px rgba(0,0,0,0.06)',
                                },
                            }}
                        >
                            {t(tab.label)}
                        </Button>
                    );
                })}
            </div>
        </aside>
    );
}
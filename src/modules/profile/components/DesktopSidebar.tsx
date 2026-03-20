import {useTranslation} from "react-i18next";
import {Tab} from "@/src/types";

interface DesktopSidebarProps {
    TABS: { id: Tab; label: string; icon: React.ReactNode }[],
    activeTab: string,
    setActiveTab: (activeTab: Tab) => void,
    showLogoutDialog: () => void
}

export default function DesktopSidebar({TABS, activeTab, setActiveTab, showLogoutDialog}: DesktopSidebarProps) {
    const {t} = useTranslation();

    function handleClick(tabId: Tab) {
        if (tabId !== 'logout') setActiveTab(tabId);
        else showLogoutDialog();
    }

    return (
        <aside className="flex flex-col gap-2  mr-4" style={{width: 260, flexShrink: 0}}>
            {TABS.map(tab => {
                const active = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => handleClick(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            width: '100%',
                            padding: '12px 16px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: active ? 600 : 400,
                            color: active ? '#ffffff' : '#1a3c2e',
                            backgroundColor: active ? '#1a3c2e' : '#ffffff',
                            textAlign: 'left',
                            transition: 'background-color 0.15s, box-shadow 0.15s',
                            borderRadius: active ? '4px 20px 20px 4px' : '8px',
                            boxShadow: active
                                ? '2px 2px 8px rgba(26, 60, 46, 0.25)'
                                : '0 1px 3px rgba(0,0,0,0.06)',
                        }}
                    >
                        {tab.icon}
                        {t(tab.label)}
                    </button>
                );
            })}
        </aside>
    );
}

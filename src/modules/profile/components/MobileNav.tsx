import {useTranslation} from "react-i18next";
import {Tab} from "@/src/types";

interface MobileNavProps {
    TABS: { id: Tab; label: string; icon: React.ReactNode }[],
    activeTab: string,
    setActiveTab: (activeTab: Tab) => void,
    showLogoutDialog: () => void
}

export default function MobileNav({TABS, activeTab, setActiveTab, showLogoutDialog}: MobileNavProps) {
    const {t} = useTranslation();

    function handleClick(tabId: Tab) {
        if (tabId !== 'logout') setActiveTab(tabId);
        else showLogoutDialog();
    }

    return (
        <nav className="flex gap-1 py-4 overflow-x-auto">
            {TABS.map(tab => {
                const active = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => handleClick(tab.id)}
                        style={{
                            flex: 1,
                            padding: '10px 4px',
                            borderRadius: 8,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: active ? 600 : 400,
                            color: active ? '#ffffff' : '#1a3c2e',
                            backgroundColor: active ? '#1a3c2e' : 'transparent',
                            whiteSpace: 'nowrap',
                            transition: 'background-color 0.15s',
                            minWidth: 72,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                        }}
                    >
                        {tab.icon}
                        {t(tab.label)}
                    </button>
                );
            })}
        </nav>
    );
}

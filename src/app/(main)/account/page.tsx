'use client';

import {SyntheticEvent, useState} from 'react'

import withPrivateRoute from "@/src/utils/withPrivateRoute";
import {useUserHook} from "@/src/hooks/useUserHook";

import ProfileSection from "@/src/modules/profile/sections/ProfileSection";
import DashboardSection from "@/src/modules/profile/sections/DashboardSection";
import OrdersSection from "@/src/modules/profile/sections/OrdersSection";
import AccountHeader from "@/src/modules/profile/components/AccountHeader";
import DesktopSidebar from "@/src/modules/profile/components/DesktopSidebar";
import MobileNav from "@/src/modules/profile/components/MobileNav";
import LogoutDialog from "@/src/modules/profile/components/LogoutDialog";

import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

type Tab = 'profile' | 'dashboard' | 'orders' | 'logout';


const SECTION_MAP: Record<Tab, React.ReactNode> = {
    profile:   <ProfileSection />,
    // dashboard: <DashboardSection />,
    orders:    <OrdersSection />,
};
const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile',   label: 'account.nav.profile',   icon: <PersonOutlineIcon fontSize="small" /> },
    // { id: 'dashboard', label: 'account.nav.dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
    { id: 'orders',    label: 'account.nav.orders',    icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
    { id: 'logout', label: 'account.nav.logout', icon: <ExitToAppIcon fontSize="small" /> }
];

export default withPrivateRoute(AccountPage);
function AccountPage() {
    const [activeTab, setActiveTab] = useState<Tab>('profile')
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const {user, handleLogout} = useUserHook()

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(TABS[newValue].id)
    };

    return (
        <div className="account-page">
            <div className="account-framer">

                <div className="flex">
                    {/* Mobile nav + content */}
                    <div className="flex flex-col gap-4 md:hidden w-full">
                      <MobileNav user={user} tabs={TABS} activeTab={activeTab} handleTabChange={handleTabChange} showLogoutDialog={() => setShowDialog(true)}/>
                        <main>
                            {SECTION_MAP[activeTab]}
                        </main>
                    </div>

                    {/* Desktop main content */}
                    <main className="hidden md:flex w-full">
                        <DesktopSidebar user={user}  TABS={TABS} activeTab={activeTab} setActiveTab={setActiveTab} showLogoutDialog={() => setShowDialog(true)} />
                        {SECTION_MAP[activeTab]}
                    </main>
                </div>
            </div>

            <LogoutDialog open={showDialog} onClose={() => setShowDialog(false)} onLogout={handleLogout}/>
        </div>
    );
}

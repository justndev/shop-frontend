'use client';

import { useState } from 'react'

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

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile',   label: 'account.nav.profile',   icon: <PersonOutlineIcon fontSize="small" /> },
    { id: 'dashboard', label: 'account.nav.dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
    { id: 'orders',    label: 'account.nav.orders',    icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
    { id: 'logout', label: 'account.nav.logout', icon: <ExitToAppIcon fontSize="small" /> }
];

const SECTION_MAP: Record<Tab, React.ReactNode> = {
    profile:   <ProfileSection />,
    dashboard: <DashboardSection />,
    orders:    <OrdersSection />,
};


export default withPrivateRoute(AccountPage);
function AccountPage() {
    const [activeTab, setActiveTab] = useState<Tab>('profile')
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const {user, handleLogout} = useUserHook()

    return (
        <div className="account-page">
            <div className="account-framer">
                <AccountHeader user={user!}/>

                <div className="flex">
                    {/* Mobile nav + content */}
                    <div className="flex flex-col flex-1 md:hidden">
                      <MobileNav TABS={TABS} activeTab={activeTab} setActiveTab={setActiveTab} showLogoutDialog={() => setShowDialog(true)}/>
                        <main>
                            {SECTION_MAP[activeTab]}
                        </main>
                    </div>

                    {/* Desktop main content */}
                    <main className="hidden md:flex">
                        <DesktopSidebar TABS={TABS} activeTab={activeTab} setActiveTab={setActiveTab} showLogoutDialog={() => setShowDialog(true)} />
                        {SECTION_MAP[activeTab]}
                    </main>
                </div>
            </div>

            <LogoutDialog open={showDialog} onClose={() => setShowDialog(false)} onLogout={handleLogout}/>
        </div>
    );
}

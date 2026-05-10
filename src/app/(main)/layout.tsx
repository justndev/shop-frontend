'use client';

import CartSidebar from '@/src/modules/cart/CartSidebar'
import Header from "@/src/modules/layout/Header";
import Footer from "@/src/modules/layout/Footer";
import CancelOrderDialog from "@/src/modules/layout/CancelOrderDialog";


export default function MainLayout({children}: { children: React.ReactNode }) {

    return (
        <>
            <Header />
            <main className="min-h-screen w-full h-full">{children}</main>
            <CartSidebar />
            <Footer/>
            <CancelOrderDialog/>
        </>
    )
}

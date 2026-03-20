'use client'

// src/app/(main)/layout.tsx
import Footer from '@/src/modules/layout/Footer'
import CartSidebar from '@/src/modules/cart/CartSidebar'
import {ToastContainer} from '@/src/modules/ui/Toast'
import Header from "@/src/modules/landing/Header";

export default function MainLayout({children}: { children: React.ReactNode }) {
    return (
        <>
            <Header/>
            <main className="min-h-screen pt-15">{children}</main>
            {/*<Footer/>*/}
            <CartSidebar/>
            <ToastContainer/>
        </>
    )
}
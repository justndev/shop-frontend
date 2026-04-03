'use client'

// src/app/(main)/layout.tsx
import Footer from '@/src/modules/layout/Footer'
import CartSidebar from '@/src/modules/cart/CartSidebar'
import {ToastContainer} from '@/src/modules/ui/Toast'
import Header from "@/src/modules/landing/Header";
import {useState} from "react";

export default function MainLayout({children}: { children: React.ReactNode }) {
    const [cartOpen, setCartOpen] = useState(false);

    function toggleCart() {
        setCartOpen(!cartOpen);
    }

    return (
        <>
            <Header toggleCart={toggleCart}/>
            <main className="min-h-screen pt-15">{children}</main>
            {/*<Footer/>*/}
            <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
            <ToastContainer/>
        </>
    )
}
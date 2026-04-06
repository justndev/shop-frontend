'use client'

import CartSidebar from '@/src/modules/cart/CartSidebar'
import {ToastContainer} from '@/src/modules/ui/Toast'
import Header from "@/src/modules/landing/Header";
import useCartHook from "@/src/hooks/useCartHook";


export default function MainLayout({children}: { children: React.ReactNode }) {
    const { showCart, toggleShowCart } = useCartHook();

    return (
        <>
            <Header toggleCart={toggleShowCart}/>
            <main className="min-h-screen pt-15">{children}</main>
            <CartSidebar open={showCart} onClose={toggleShowCart} />
            <ToastContainer/>
        </>
    )
}
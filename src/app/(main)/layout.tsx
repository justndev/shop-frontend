'use client'

import CartSidebar from '@/src/modules/cart/CartSidebar'
import Header from "@/src/modules/layout/Header";
import useCartHook from "@/src/modules/cart/useCartHook";
import Footer from "@/src/modules/layout/Footer";


export default function MainLayout({children}: { children: React.ReactNode }) {
    const { showCart, toggleShowCart } = useCartHook();

    return (
        <>
            <Header toggleCart={toggleShowCart}/>
            <main className="min-h-screen pt-15 w-full h-full">{children}</main>
            <CartSidebar open={showCart} onClose={toggleShowCart} />
            <Footer/>
        </>
    )
}
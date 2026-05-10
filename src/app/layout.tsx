"use client";

import {Provider} from 'react-redux'
import {ThemeProvider} from "@mui/material";
import {PersistGate} from "redux-persist/integration/react";

import {persistor, store} from '@/src/store'
import {theme} from "@/src/utils/theme";
import '@/src/utils/i18n';

import {Montserrat} from 'next/font/google';
import './globals.css';
import OrderListener from "@/src/modules/checkout/OrderListener";
import {AppProvider} from "@/src/context/AppContext";

const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
});


export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" className={montserrat.className}>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link
                href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
        </head>
        <body>
        <PersistGate persistor={persistor}>
            <Provider store={store}>
                <AppProvider>
                    <ThemeProvider theme={theme}>
                        {children}
                    </ThemeProvider>
                    <OrderListener />
                </AppProvider>
            </Provider>
        </PersistGate>
        </body>
        </html>
    )
}

// src/context/AppContext.tsx
'use client';

import React, {createContext, useContext, useRef, useCallback, useState} from 'react';
import { useDispatch } from 'react-redux';

interface AppContextValue {
    openCancelOrderDialog: (onConfirm: () => void | Promise<void>) => void;
    handleConfirm: () => void;
    closeCancelOrderDialog:  () => void;
    showCancelOrderDialog: boolean;

    openCart: () => void;
    closeCart: () => void;
    showCart: boolean;
    toggleCart: () => void;

    showMediaManager: boolean;
    openMediaManager: () => void;
    closeMediaManager: () => void;
    toggleMediaManager: () => void;

    onMediaInsert: () => void;
    setOnMediaInsert: (fn: ()=>void) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const [showCancelOrderDialog, setShowCancelOrderDialog] = useState(false);
    const [showCart, setShowCart] = useState(false);

    const [showMediaManager, setShowMediaManager] = useState(false);
    const [onMediaInsert, setOnMediaInsert] = useState(() => console.log(''));

    const onConfirmRef = useRef<(() => void | Promise<void>) | null>(null);


    function closeCart(){
        setShowCart(false);
    }
    function openCart(){
        setShowCart(true);
    }
    function toggleCart(){
        setShowCart(!showCart);
    }

    function closeMediaManager(){
        setShowMediaManager(false);
    }
    function openMediaManager(){
        setShowMediaManager(true);
    }
    function toggleMediaManager(){
        setShowMediaManager(!showMediaManager);
    }

    const openCancelOrderDialog = useCallback((onConfirm: () => void | Promise<void>) => {
        onConfirmRef.current = onConfirm;
        setShowCancelOrderDialog(true);
    }, [dispatch]);

    const closeCancelOrderDialog = useCallback(() => {
        setShowCancelOrderDialog(false);
    }, [dispatch]);

    const handleConfirm = useCallback(async () => {
        await onConfirmRef.current?.();
        onConfirmRef.current = null;
        setShowCancelOrderDialog(false);
    }, [dispatch]);

    return (
        <AppContext.Provider
            value={{
                openCancelOrderDialog,
                handleConfirm,
                closeCancelOrderDialog,
                showCancelOrderDialog,

                openCart,
                closeCart,
                showCart,
                toggleCart,

                showMediaManager,
                openMediaManager,
                closeMediaManager,
                toggleMediaManager,
                setOnMediaInsert
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppContext must be used within AppProvider');
    return ctx;
}
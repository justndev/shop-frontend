"use client";

import "@prisma/studio-core/ui/index.css";
import { ReactNode } from "react";

interface StudioWrapperProps {
    children: ReactNode;
}

export default function StudioWrapper({ children }: StudioWrapperProps) {
    return (
        <div className="h-screen flex flex-col bg-gray-50"
             style={{ height: 'calc(100dvh - 48px)' }} // replace 64px with your outer header height

        >
            <header className="bg-white shadow-sm border-b shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Database Studio</h1>
                        <div className="text-sm text-gray-500">Powered by Prisma Studio</div>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
}

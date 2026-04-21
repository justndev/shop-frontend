'use client';

import FiltersBar from "@/src/modules/catalog/FiltersBar";
import CatalogMenu from "@/src/modules/catalog/CatalogMenu";

export default function CatalogLayout({ children }) {
    return (
        <div style={{ minHeight: '100vh', background: '#FCFCFC' }}>
            <div className='flex-1 w-full max-w-375 pt-13 h-full mx-auto'>
                <div className=' text-[var(--swamp-green)] font-medium text-sm'>
                    {"Catalog > Tea > Pu\'er"}
                </div>
                <div className='flex flex-col justify-center w-full md:flex-row mt-4 gap-4'>
                    <CatalogMenu />
                    <div className="flex-1 h-full">
                        <FiltersBar />
                        <div className="-mt-10 pb-15">
                            {children}
                        </div>

                    </div>
                </div>


            </div>
        </div>
    );
}

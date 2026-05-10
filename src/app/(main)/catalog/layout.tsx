'use client';

import FiltersBar from "@/src/modules/catalog/FiltersBar";
import CatalogMenu from "@/src/modules/catalog/CatalogMenu";
import AppBreadcrumb from "@/src/modules/layout/AppBreadcrumb";


export default function CatalogLayout({ children }) {
    return (
        <div className='bg-(--white-dim) min-h-screen'>
            <div className='flex-1 max-w-375 pt-15 mx-auto'>
               <AppBreadcrumb/>
                <div className='flex flex-col justify-center md:flex-row mt-4 gap-4'>
                    <CatalogMenu />
                    <div className="flex-1">
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

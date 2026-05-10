'use client';

import {useTranslation} from 'react-i18next';
import {Divider} from "@mui/material";
import AppBreadcrumb from "@/src/modules/layout/AppBreadcrumb";

import config from "@/src/config";

const COMPANY_EMAIL = config.COMPANY_EMAIL;
const LAST_UPDATED = config.LAST_UPDATED;
const COMPANY = config.COMPANY;
const REG = config.REG;
const ADDRESS = config.ADDRESS;
const CATALOG = config.CATALOG;
const SHOP_URL = config.SHOP_URL;

function interp(str: string, vars: Record<string, string>): string {
    return str.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
}

const BADGE_CLASSES: Record<string, string> = {
    Essential: 'bg-[#e1f5ee] text-[#0f6e56]',
    Analytics: 'bg-[#faeeda] text-[#854f0b]',
};

export default function CookiePolicyPage() {
    const {t} = useTranslation();
    const ns = 'legal.cookies';
    const vars = {email: COMPANY_EMAIL, shop: SHOP_URL, date: LAST_UPDATED, company: COMPANY, catalog: CATALOG};
    const tx = (key: string) => interp(t(`${ns}.${key}`), vars);

    const cookieRows = ['row-1', 'row-2', 'row-3', 'row-4', 'row-5'];

    const sections = [
        {
            key: 'section-3',
            paragraphs: ['p1'],
        },
        {
            key: 'section-4',
            paragraphs: ['p1', 'p2'],
        },
        {
            key: 'section-5',
            paragraphs: ['p1'],
            listItems: ['li-1', 'li-2', 'li-3'],
            afterList: ['p2'],
        },
        {
            key: 'section-6',
            paragraphs: ['p1'],
        },
    ];

    return (
        <div className="bg-(--beige) min-h-screen">
            <div className="max-w-190 mx-auto py-15 px-8 flex flex-col gap-8">
                <AppBreadcrumb/>

                <header className='flex flex-col gap-4'>
                    <h1 className="font-bold text-4xl text-(--coal)">
                        {tx('page-header.h1')}
                    </h1>
                    <p className="text-sm text-(--beige-grey)">
                        {tx('page-header.last-updated')}
                    </p>

                    <Divider/>

                    <p className="text-(--coal-bright) leading-[1.75]">
                        {tx('intro.p1')}
                    </p>
                </header>

                <div className="flex flex-col gap-10 text-justify">

                    {/* Section 1 */}
                    <section className="border-l-2 border-(--green-pale) pl-4">
                        <h2 className="font-semibold text-base text-(--coal) mb-3">
                            {tx('section-1.h2')}
                        </h2>
                        <p className="text-sm text-(--coal-bright) leading-[1.8] mb-2.5 last:mb-0">
                            {tx('section-1.p1')}
                        </p>
                        <p className="text-sm text-(--coal-bright) leading-[1.8] mb-2.5 last:mb-0">
                            {tx('section-1.p2')}
                        </p>
                    </section>

                    {/* Section 2 — cookie table */}
                    <section className="border-l-2 border-(--green-pale) pl-4">
                        <h2 className="font-semibold text-base text-(--coal) mb-3">
                            {tx('section-2.h2')}
                        </h2>
                        <p className="text-sm text-(--coal-bright) leading-[1.8] mb-2.5">
                            {tx('section-2.p1')}
                        </p>

                        <div className="overflow-x-auto my-3 rounded-md border border-[#d8d4cc]/50">
                            <table className="w-full border-collapse font-sans text-[0.85rem]">
                                <thead>
                                <tr>
                                    {['col-name', 'col-purpose', 'col-duration', 'col-type'].map(col => (
                                        <th
                                            key={col}
                                            className="bg-[#f0ede6] text-(--coal) font-semibold text-[0.75rem] tracking-[0.06em] uppercase text-left px-3.5 py-2.5 border-b border-[#d8d4cc]"
                                        >
                                            {tx(`cookie-table.${col}`)}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {cookieRows.map(row => {
                                    const type = tx(`cookie-table.${row}-type`);
                                    return (
                                        <tr key={row}>
                                            <td className="px-3.5 py-2.5 text-(--coal-bright) border-b border-[#e8e4dc]/50 align-top last:border-b-0">
                                                <code>{tx(`cookie-table.${row}-name`)}</code>
                                            </td>
                                            <td className="px-3.5 py-2.5 text-(--coal-bright) border-b border-[#e8e4dc]/50 align-top last:border-b-0">
                                                {tx(`cookie-table.${row}-purpose`)}
                                            </td>
                                            <td className="px-3.5 py-2.5 text-(--coal-bright) border-b border-[#e8e4dc]/50 align-top last:border-b-0">
                                                {tx(`cookie-table.${row}-duration`)}
                                            </td>
                                            <td className="px-3.5 py-2.5 border-b border-[#e8e4dc]/50 align-top last:border-b-0">
                                                    <span className={`inline-block px-2 py-0.5 rounded text-[0.75rem] font-medium ${BADGE_CLASSES[type] ?? ''}`}>
                                                        {type}
                                                    </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Sections 3–6 via loop */}
                    {sections.map(({key, paragraphs, listItems, afterList}) => (
                        <section key={key} className="border-l-2 border-(--green-pale) pl-4">
                            <h2 className="font-semibold text-base text-(--coal) mb-3">
                                {tx(`${key}.h2`)}
                            </h2>

                            {paragraphs.map(p => (
                                <p key={p} className="text-sm text-(--coal-bright) leading-[1.8] mb-2.5 last:mb-0">
                                    {tx(`${key}.${p}`)}
                                </p>
                            ))}

                            {listItems && (
                                <ul className="mt-2 mb-2.5 list-none flex flex-col gap-1.5">
                                    {listItems.map(li => (
                                        <li key={li} className="text-sm text-(--coal-bright) leading-[1.7] pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-(--green-pale)">
                                            {tx(`${key}.${li}`)}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {afterList?.map(p => (
                                <p key={p} className="text-sm text-(--coal-bright) leading-[1.8] m-0 mb-2.5 last:mb-0">
                                    {tx(`${key}.${p}`)}
                                </p>
                            ))}
                        </section>
                    ))}

                </div>

            </div>
        </div>
    );
}
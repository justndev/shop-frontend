'use client';

import { useTranslation } from 'react-i18next';
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

export default function PrivacyPolicyPage() {
    const { t } = useTranslation();
    const ns = 'legal.privacy-policy';
    const vars = { email: COMPANY_EMAIL, date: LAST_UPDATED, company: COMPANY, reg: REG, address: ADDRESS};
    const tx = (key: string) => interp(t(`${ns}.${key}`), vars);

    const sections = [
        {
            key: 'section-1',
            paragraphs: ['p1'],
        },
        {
            key: 'section-2',
            paragraphs: ['p1', 'p2'],
        },
        {
            key: 'section-3',
            paragraphs: ['p1'],
            listItems: ['li-1', 'li-2', 'li-3', 'li-4', 'li-5'],
        },
        {
            key: 'section-4',
            paragraphs: ['p1'],
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
            listItems: ['li-1', 'li-2', 'li-3', 'li-4', 'li-5', 'li-6'],
            afterList: ['p2'],
        },
        {
            key: 'section-7',
            paragraphs: ['p1'],
        },
        {
            key: 'section-8',
            paragraphs: ['p1'],
        },
    ];

    return (
        <div className="bg-(--beige) min-h-screen">
            <div className="max-w-190 mx-auto py-15 px-8 flex flex-col gap-8">
                <AppBreadcrumb/>

                <header className='flex flex-col gap-4'>
                    <h1 className="font-bold text-4xl text-(--coal) ">
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
                    {sections.map(({key, paragraphs, listItems, afterList}) => (
                        <section key={key} className="border-l-2 border-(--green-pale) pl-4 ">
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
'use client';

import { useTranslation } from 'react-i18next';
import '@/src/styles/legal-page.css';

const COMPANY_EMAIL = '[your@email.com]';
const SHOP_URL = '[yourshop.ee]';
const LAST_UPDATED = '2 April 2025';

function interp(str: string, vars: Record<string, string>): string {
    return str.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
}

const BADGE_CLASS: Record<string, string> = {
    Essential: 'legal-page__badge legal-page__badge--essential',
    Analytics: 'legal-page__badge legal-page__badge--analytics',
};

export default function CookiePolicyPage() {
    const { t } = useTranslation();
    const ns = 'legal.cookies';
    const vars = { email: COMPANY_EMAIL, shop: SHOP_URL, date: LAST_UPDATED };
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
        <div className="legal-page">
            <div className="legal-page__inner">

                <header className="legal-page__header">
                    <span className="legal-page__overline">{tx('page-header.overline')}</span>
                    <h1 className="legal-page__h1">{tx('page-header.h1')}</h1>
                    <p className="legal-page__last-updated">{tx('page-header.last-updated')}</p>
                </header>

                <p className="legal-page__intro">{tx('intro.p1')}</p>

                <div className="legal-page__sections">

                    {/* Section 1 */}
                    <section className="legal-page__section">
                        <h2 className="legal-page__h2">{tx('section-1.h2')}</h2>
                        <p className="legal-page__p">{tx('section-1.p1')}</p>
                        <p className="legal-page__p">{tx('section-1.p2')}</p>
                    </section>

                    {/* Section 2 — cookie table, rendered manually */}
                    <section className="legal-page__section">
                        <h2 className="legal-page__h2">{tx('section-2.h2')}</h2>
                        <p className="legal-page__p">{tx('section-2.p1')}</p>

                        <div className="legal-page__table-wrapper">
                            <table className="legal-page__table">
                                <thead>
                                <tr>
                                    <th>{tx('cookie-table.col-name')}</th>
                                    <th>{tx('cookie-table.col-purpose')}</th>
                                    <th>{tx('cookie-table.col-duration')}</th>
                                    <th>{tx('cookie-table.col-type')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cookieRows.map(row => {
                                    const type = tx(`cookie-table.${row}-type`);
                                    return (
                                        <tr key={row}>
                                            <td><code>{tx(`cookie-table.${row}-name`)}</code></td>
                                            <td>{tx(`cookie-table.${row}-purpose`)}</td>
                                            <td>{tx(`cookie-table.${row}-duration`)}</td>
                                            <td><span className={BADGE_CLASS[type] ?? 'legal-page__badge'}>{type}</span></td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Sections 3–6 via loop */}
                    {sections.map(({ key, paragraphs, listItems, afterList }) => (
                        <section key={key} className="legal-page__section">
                            <h2 className="legal-page__h2">{tx(`${key}.h2`)}</h2>

                            {paragraphs.map(p => (
                                <p key={p} className="legal-page__p">{tx(`${key}.${p}`)}</p>
                            ))}

                            {listItems && (
                                <ul className="legal-page__ul">
                                    {listItems.map(li => (
                                        <li key={li} className="legal-page__li">{tx(`${key}.${li}`)}</li>
                                    ))}
                                </ul>
                            )}

                            {afterList?.map(p => (
                                <p key={p} className="legal-page__p">{tx(`${key}.${p}`)}</p>
                            ))}
                        </section>
                    ))}

                </div>

                <div className="legal-page__footer-note">
                    <p className="legal-page__p">
                        {tx('footer-note.p1').split(COMPANY_EMAIL)[0]}
                        <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
                        {tx('footer-note.p1').split(COMPANY_EMAIL)[1]}
                    </p>
                </div>

            </div>
        </div>
    );
}
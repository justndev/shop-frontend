"use client";

import {Breadcrumbs, Divider, Link, Tab, Tabs, Typography, Tooltip} from "@mui/material";
import {useRouter, usePathname} from "next/navigation";
import {useTranslation} from "react-i18next";
import {slugFromPath} from "@/src/utils/functions";

const PARENT_SLUG = "tea";

const CATEGORIES = [
    {slug: "shu-puer", comingSoon: false},
    {slug: "shen-puer", comingSoon: true},
] as const;

type CategorySlug = (typeof CATEGORIES)[number]["slug"];

const ACTIVE_SLUGS = CATEGORIES
    .filter(c => !c.comingSoon)
    .map(c => c.slug) as CategorySlug[];


export default function CatalogMenuNew() {
    const {t} = useTranslation();
    const router = useRouter();
    const pathname = usePathname();

    const activeSlug = slugFromPath(pathname) ?? ACTIVE_SLUGS[0];
    const activeIndex = CATEGORIES.findIndex(c => c.slug === activeSlug);

    function onTabChange(_: React.SyntheticEvent, newIndex: number) {
        const target = CATEGORIES[newIndex];
        if (target.comingSoon) return;
        router.push(`/catalog/${target.slug}`);
    }

    return (
        <div className='flex flex-col gap-4' style={{ position: 'sticky', top: '80px', alignSelf: 'flex-start' }}>
            <a className='text-2xl font-bold text-[var(--swamp-green)]'>{t(`categories.${activeSlug}`)}</a>
            <Divider></Divider>
            <Tabs
                value={activeIndex}
                onChange={onTabChange}
                orientation="vertical"
                sx={{
                    "& .MuiTab-root": {
                        alignItems: "flex-start",
                        textTransform: "none",
                        fontSize: "0.88rem",
                        color: "#6b6b5e",
                        minHeight: 36,
                        py: "6px",
                        fontFamily: "'DM Sans', sans-serif",
                    },
                    "& .Mui-selected": {color: "#1a3c2e !important", fontWeight: 600},
                    "& .MuiTabs-indicator": {
                        backgroundColor: "#1a3c2e",
                        left: 0,
                        right: "unset",
                    },
                }}
            >
                {CATEGORIES.map(({slug, comingSoon}, i) => (

                    <Tab key={slug}
                         label={
                             <span style={{display: "flex", alignItems: "center", gap: 6}}>
                                            {t(`categories.${slug}`)}

                                        </span>
                         }
                         value={i}
                         disabled={comingSoon}
                         sx={{
                             width: "100%",
                             ...(comingSoon && {
                                 opacity: "1 !important",      // MUI sets 0.38 on disabled — override it
                                 color: "#b8b5aa !important",  // muted but legible
                                 cursor: "default",
                                 pointerEvents: "none",
                                 textAlign: 'left'
                             }),
                         }}
                    />
                ))}
            </Tabs>
        </div>
    );
}


function CatalogMenuOld() {
    const {t} = useTranslation();
    const router = useRouter();
    const pathname = usePathname();

    const activeSlug = slugFromPath(pathname) ?? ACTIVE_SLUGS[0];
    const activeIndex = CATEGORIES.findIndex(c => c.slug === activeSlug);

    function onTabChange(_: React.SyntheticEvent, newIndex: number) {
        const target = CATEGORIES[newIndex];
        if (target.comingSoon) return;
        router.push(`/catalog/${target.slug}`);
    }

    return (
        <div className='flex flex-col gap-4'>

            <Breadcrumbs sx={{align: 'end', "& ol": {flexWrap: "nowrap"}}}>
                <Link
                    underline="hover"
                    href="/catalog"
                    sx={{fontSize: "0.8rem", color: "#888880"}}
                >
                    <Typography sx={{fontSize: "1.2rem", color: "#1a1a14", fontWeight: 600}}>
                        {t("dev.tea")}
                    </Typography>
                </Link>
                <Typography sx={{fontSize: "0.8rem", color: "#1a1a14"}}>
                    {t(`categories.${activeSlug}`)}
                </Typography>
            </Breadcrumbs>

            {/* Green accent divider */}
            <div style={{
                height: '3px',
                background: '#1a3c2e',
            }}/>
            <Tabs
                value={activeIndex}
                onChange={onTabChange}
                orientation="vertical"
                sx={{
                    "& .MuiTab-root": {
                        alignItems: "flex-start",
                        textTransform: "none",
                        fontSize: "0.88rem",
                        color: "#6b6b5e",
                        minHeight: 36,
                        py: "6px",
                        fontFamily: "'DM Sans', sans-serif",
                    },
                    "& .Mui-selected": {color: "#1a3c2e !important", fontWeight: 600},
                    "& .MuiTabs-indicator": {
                        backgroundColor: "#1a3c2e",
                        left: 0,
                        right: "unset",
                    },
                }}
            >
                {CATEGORIES.map(({slug, comingSoon}, i) => (

                    <Tab key={slug}
                         label={
                             <span style={{display: "flex", alignItems: "center", gap: 6}}>
                                            {t(`categories.${slug}`)}

                                        </span>
                         }
                         value={i}
                         disabled={comingSoon}
                         sx={{
                             width: "100%",
                             ...(comingSoon && {
                                 opacity: "1 !important",      // MUI sets 0.38 on disabled — override it
                                 color: "#b8b5aa !important",  // muted but legible
                                 cursor: "default",
                                 pointerEvents: "none",
                                 textAlign: 'left'
                             }),
                         }}
                    />
                ))}
            </Tabs>
        </div>
    );
}
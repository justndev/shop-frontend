"use client";

import {useTranslation} from "react-i18next";
import {useRouter, usePathname} from "next/navigation";

import {slugFromPath} from "@/src/utils/functions";

import {Breadcrumbs, Divider, Link, Tab, Tabs, Typography} from "@mui/material";

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
        <div className='flex flex-col gap-4 self-start sticky top-20'>
            <a className='text-2xl font-bold text-(--swamp-green)'>{t(`categories.${activeSlug}`)}</a>
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
                        color: "var(--beige-grey)",
                        minHeight: 36,
                        py: "6px",
                        fontFamily: "'DM Sans', sans-serif",
                    },
                    "& .Mui-selected": {color: "var(--green-pale) !important", fontWeight: 600},
                    "& .MuiTabs-indicator": {
                        backgroundColor: "var(--green-pale)",
                        left: 0,
                        right: "unset",
                    },
                }}
            >
                {CATEGORIES.map(({slug, comingSoon}, i) => (

                    <Tab key={slug}
                         label=
                                 {t(`categories.${slug}`)}

                         value={i}
                         disabled={comingSoon}
                         sx={{
                             width: "100%",
                             ...(comingSoon && {
                                 opacity: "1 !important",      // MUI sets 0.38 on disabled — override it
                                 color: "var(--grey-light) !important",  // muted but legible
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

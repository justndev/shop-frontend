'use client';

import {useTranslation, Trans} from 'react-i18next';
import {useScrollReveal} from "@/src/lib/useScrollReveal";
import {Divider} from "@mui/material";
import PuerCloud from "@/src/modules/docs/PuerCloud";

import {Geist_Mono} from 'next/font/google'
import {useParams, usePathname, useSearchParams} from "next/navigation";
import {useEffect, useRef} from "react";

const geistMono = Geist_Mono({
    subsets: ['latin'],
})

function T({i18nKey}: { i18nKey: string }) {
    return <Trans i18nKey={i18nKey} components={{b: <strong/>}}/>;
}

const MISSION_PILLARS = [{label: 'about.fair_price', icon: '/icons/euro.svg'}, {
    label: 'about.quality_tea',
    icon: '/icons/quality.svg'
}, {label: 'about.honest_taste', icon: '/icons/tongue.svg'}, {label: 'about.real_effect', icon: '/icons/effect.svg'}]

export default function AboutUsPage() {
    const searchParams = useSearchParams();
    const section = searchParams.get("section");
    const scrollRef = useRef(null);

    useEffect(() => {
        if (section && scrollRef.current) {
            scrollRef.current.scrollIntoView()
        }
    }, [])

    const {t} = useTranslation();
    useScrollReveal();
    const tx = (key: string) => `about.${key}`;

    return (
        <div className="bg-[#faf9f7] min-h-screen text-justify" style={{fontFamily: "'DM Sans', sans-serif"}}>

            {/* ── HERO HEADER ── */}
            <div className="mx-auto max-w-300 px-8 py-18 flex flex-col gap-6">
                <span
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase"
                    style={{color: 'var(--green-pale)'}}
                >
                <span className="w-6 h-px" style={{background: 'var(--green-pale)'}}/>
                    {t('about.badge')}
                </span>

                <h1
                    className="text-6xl font-bold leading-[1.1] tracking-tight text-(--ink) max-w-[680px]"
                    style={{fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em'}}
                >
                    {t('about.heading')}
                </h1>

                {/* col on mobile, row on desktop */}
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16 mt-4">
                    <p className="text-base text-(--about-us-text) leading-relaxed max-w-[480px] shrink-0">
                        <T i18nKey="about.intro"/>
                    </p>

                    {/* Takes remaining width on desktop, full width on mobile */}
                    <div className="w-full lg:flex-1">
                        <PuerCloud height={200} color="var(--green-pale)"/>
                    </div>
                </div>
            </div>


            {/* ── CONTENT ── */}
            <div className="px-8">
                <Divider sx={{bgcolor: 'var(--mint)'}} ref={scrollRef}/>

                {/* ── Section 1: What is Puer — full width with big image ── */}
                <section id="puer" className="reveal py-20 mx-auto max-w-300" >
                    <div className="flex flex-col gap-10">

                        <div className="flex items-end justify-between gap-8">
                            <div className="flex flex-col gap-4 max-w-[560px]">
                                <h2 className="text-4xl font-bold text-(--ink) tracking-tight"
                                    style={{fontFamily: "'DM Serif Display', serif"}}>
                                    <T i18nKey={tx('puer_heading')}/>
                                </h2>
                                <p className="text-(--about-us-text) leading-relaxed text-base">
                                    <T i18nKey={tx('puer_p1')}/>
                                </p>
                            </div>

                            <div className="hidden lg:flex flex-col gap-3 pb-1">
                                {(['puer_quality_1', 'puer_quality_2', 'puer_quality_3'] as const).map((key, i) => (
                                    <div key={key} className="flex items-center gap-3">
                                        <span
                                            className="w-1.5 h-1.5 rounded-full shrink-0"
                                            style={{background: 'var(--green-pale)'}}
                                        />
                                        <span className="text-sm text-(--about-us-text)">
                                            <T i18nKey={tx(key)}/>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Big panoramic image */}
                        <div
                            className="w-full overflow-hidden rounded-2xl"
                            style={{aspectRatio: '21/8', boxShadow: '0 24px 64px rgba(0,0,0,0.08)'}}
                        >
                            <img
                                src="/slide2.webp"
                                alt="Puer tea"
                                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                            />
                        </div>

                        <p className="text-(--about-us-text) leading-relaxed text-base max-w-[640px]">
                            <T i18nKey={tx('puer_p2')}/>
                        </p>
                    </div>
                </section>

                <Divider sx={{bgcolor: 'var(--mint)'}}/>


                {/* ── Section 2: Effects — text left, image right ── */}
                <section id="effects" className="reveal py-20 mx-auto max-w-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                        <div>
                            <div
                                className="w-full overflow-hidden rounded-2xl"
                                style={{aspectRatio: '4/5', boxShadow: '0 24px 64px rgba(0,0,0,0.1)'}}
                            >
                                <img
                                    src="/slide3.webp"
                                    alt="Puer tea effects"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Accent card — below image */}
                            <div
                                className={`${geistMono.className} relative mt-4 rounded-2xl px-5 py-4 flex items-center gap-4 overflow-hidden`}
                                style={{
                                    background: 'linear-gradient(135deg, #1a3d2b 0%, #0f2318 55%, #162e20 100%)',
                                    boxShadow: '0 2px 14px rgba(10,40,20,0.22), inset 0 1px 0 rgba(255,255,255,0.07)',
                                    border: '1px solid rgba(100,200,130,0.18)',
                                }}
                            >
                                {/* Top-left green glow splash */}
                                <div
                                    className="absolute -top-6 -left-6 w-28 h-28 rounded-full pointer-events-none"
                                    style={{
                                        background: 'radial-gradient(circle, rgba(80,185,110,0.22) 0%, transparent 70%)',
                                    }}
                                />
                                {/* Bottom-right warm accent */}
                                <div
                                    className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
                                    style={{
                                        background: 'radial-gradient(circle, rgba(140,220,100,0.12) 0%, transparent 70%)',
                                    }}
                                />

                                {/* Icon pill */}
                                <div
                                    className="relative shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(135deg, #4ab86e 0%, --mint 100%)',
                                        boxShadow: '0 2px 10px rgba(60,180,100,0.4)',
                                    }}
                                >
                                    <span style={{fontSize: 28}}>🍃</span>
                                </div>

                                {/* Text */}
                                <div className="relative flex flex-col gap-0.5">
                                    <p
                                        className="text-[0.65rem] font-bold tracking-[0.16em] uppercase m-0"
                                        style={{color: '#72d48e'}}
                                    >
                                        {t('about.why_it_works')}
                                    </p>
                                    <p className="text-sm leading-snug m-0 font-[500]"
                                       style={{color: 'rgba(255,255,255,0.98)'}}>
                                        <span className="font-bold"
                                              style={{color: '#ffffff'}}>{t('about.caffeine_lteanine')}</span>
                                        {t('about.duo')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <h2 className="text-4xl font-bold text-(--ink) tracking-tight"
                                style={{fontFamily: "'DM Serif Display', serif"}}>
                                <T i18nKey={tx('puer_effects_heading')}/>
                            </h2>

                            <div className="flex flex-col gap-4 text-(--about-us-text) leading-relaxed text-base">
                                {['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'].map(p => (
                                    <p key={p}>
                                        <T i18nKey={tx(`puer_effects_${p}`)}/>
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/*<Divider sx={{bgcolor: 'var(--mint)'}}/>*/}


                {/* ── Section 3: Who we are — image left, text right ── */}
                <section id="who" className="reveal py-20 mx-auto max-w-300 hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div
                            className="overflow-hidden rounded-2xl order-2 lg:order-1"
                            style={{aspectRatio: '4/3', boxShadow: '0 24px 64px rgba(0,0,0,0.1)'}}
                        >
                            <img
                                src="/slide3.webp"
                                alt="Our team"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex flex-col gap-6 order-1 lg:order-2">
                            <h2 className="text-4xl font-bold text-(--ink) tracking-tight"
                                style={{fontFamily: "'DM Serif Display', serif"}}>
                                <T i18nKey={tx('who_heading')}/>
                            </h2>
                            <div className="flex flex-col gap-4 text-(--about-us-text) leading-relaxed text-base">
                                <p><T i18nKey={tx('who_p1')}/></p>
                                {/*<p><T i18nKey={tx('who_p2')}/></p>*/}
                            </div>

                            {/* Team tag */}
                            <div className="flex items-center gap-3 mt-2">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                    style={{background: 'var(--green-pale)'}}
                                >
                                    EE
                                </div>
                                <span className="text-sm text-(--about-us-text)">{t('about.based_in_estonia')}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <Divider sx={{bgcolor: 'var(--mint)'}}/>


                {/* ── Section 4: Mission — text left, image right ── */}
                <section id="mission" className="reveal py-20 mx-auto max-w-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                        <div className="flex flex-col gap-6">
                            <h2 className="text-4xl font-bold text-(--ink) tracking-tight"
                                style={{fontFamily: "'DM Serif Display', serif"}}>
                                <T i18nKey={tx('who_heading')}/>
                            </h2>
                            <div className="flex flex-col gap-4 text-(--about-us-text) leading-relaxed text-base">
                                <p><T i18nKey={tx('who_p1')}/></p>
                                {/*<p><T i18nKey={tx('who_p2')}/></p>*/}
                            </div>

                            {/* Team tag */}
                            <div className="flex items-center gap-3 mt-2">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                    style={{background: 'var(--green-pale)'}}
                                >
                                    EE
                                </div>
                                <span className="text-sm text-(--about-us-text)">{t('about.based_in_estonia')}</span>
                            </div>
                            <h2 className="text-4xl font-bold text-(--ink) tracking-tight"
                                style={{fontFamily: "'DM Serif Display', serif"}}>
                                <T i18nKey={tx('mission_heading')}/>
                            </h2>
                            <div className="flex flex-col gap-4 text-(--about-us-text) leading-relaxed text-base">
                                {['p1', 'p2', 'p3', 'p4'].map(p => (
                                    <p key={p}><T i18nKey={tx(`mission_${p}`)}/></p>
                                ))}
                            </div>

                            {/* Mission pillars */}
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                {MISSION_PILLARS.map((pillar: { label, icon }) => (
                                    <div
                                        className={`${geistMono.className} relative mt-4 rounded-2xl px-5 py-4 flex items-center gap-4 overflow-hidden`}
                                        style={{
                                            background: 'linear-gradient(135deg, #1a3d2b 0%, #0f2318 55%, #162e20 100%)',
                                            boxShadow: '0 2px 14px rgba(10,40,20,0.22), inset 0 1px 0 rgba(255,255,255,0.07)',
                                            border: '1px solid rgba(100,200,130,0.18)',
                                        }}
                                    >
                                        {/* Top-left green glow splash */}
                                        <div
                                            className="absolute -top-6 -left-6 w-28 h-28 rounded-full pointer-events-none"
                                            style={{
                                                background: 'radial-gradient(circle, rgba(80,185,110,0.22) 0%, transparent 70%)',
                                            }}
                                        />
                                        {/* Bottom-right warm accent */}
                                        <div
                                            className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
                                            style={{
                                                background: 'radial-gradient(circle, rgba(140,220,100,0.12) 0%, transparent 70%)',
                                            }}
                                        />

                                        {/* Icon pill */}
                                        <div
                                            className="relative shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{
                                                background: 'linear-gradient(135deg, #4ab86e 0%, #ffffff 100%)',
                                                boxShadow: '0 2px 10px rgba(60,180,100,0.4)',
                                            }}
                                        >
                                            <img
                                                className='ml-[1px]'
                                                src={pillar.icon}
                                                width={35}
                                                height={35}
                                            />

                                            {/*<span style={{fontSize: 28}}>🍃</span>*/}
                                        </div>

                                        {/* Text */}
                                        <div className="relative flex flex-col gap-0.5">

                                            <p className="text-sm leading-snug m-0 font-[500]"
                                               style={{color: 'rgba(255,255,255,0.98)'}}>
                                                <span className="font-bold"
                                                      style={{color: '#ffffff'}}>{t(pillar.label)}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:sticky lg:top-24 flex flex-col gap-4">
                            <div
                                className="w-full overflow-hidden rounded-2xl"
                                style={{aspectRatio: '3/4', boxShadow: '0 24px 64px rgba(0,0,0,0.1)'}}
                            >
                                <img
                                    src="/estonia.jpg"
                                    alt="Estonia"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <Divider sx={{bgcolor: 'var(--mint)'}}/>


                {/* ── Section 5: About this site — full width, bottom ── */
                }
                <section id="site" className="reveal py-20 mx-auto max-w-300">
                    <div className="flex flex-col gap-10">

                        <div className="flex flex-col gap-6 ">
                            <h2 className="text-4xl font-bold text-(--ink) tracking-tight"
                                style={{fontFamily: "'DM Serif Display', serif"}}>
                                <T i18nKey={tx('site_heading')}/>
                            </h2>
                            <div className="flex flex-col gap-4 text-(--about-us-text) leading-relaxed">
                                {['p1', 'p2', 'p3'].map(p => (
                                    <p key={p}><T i18nKey={tx(`site_${p}`)}/></p>
                                ))}
                            </div>
                        </div>

                        <div
                            className="w-full overflow-hidden rounded-2xl relative"
                            style={{aspectRatio: '21/9', boxShadow: '0 24px 64px rgba(0,0,0,0.1)'}}
                        >
                            <img
                                src="/developer-at-work.webp"
                                alt="Developer at work"
                                className="w-full h-full object-cover"
                            />
                            {/* Subtle overlay with tagline */}
                            <div
                                className="absolute inset-0 flex items-end p-10"
                                style={{background: 'linear-gradient(to top, rgba(10,15,10,0.55) 0%, transparent 60%)'}}
                            >
                                <p className="text-white text-lg font-medium max-w-[480px] leading-snug"
                                   style={{fontFamily: "'DM Serif Display', serif"}}>
                                    {t('about.no_bloat')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

        </div>
    )
        ;
}
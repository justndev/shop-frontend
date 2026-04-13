'use client';

import {useState, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import Link from 'next/link';

import {
    IconButton,
    Badge,
    ClickAwayListener,
} from '@mui/material';
import {Collapse, Paper, List, ListItemButton, ListItemText} from '@mui/material';

import SmallHeader from "@/src/modules/landing/SmallHeader";
import Logo from "@/src/modules/landing/Logo";
import {Menu, ShoppingCart, User, X} from "lucide-react";
import {useDispatch} from "react-redux";
import {toggleCart} from "@/src/store/slices/cartSlice";
import LanguageDropdown from "@/src/shared/ui/LanguageDropdown";

const NAV_LINKS = [
    {label: 'header.nav.blog', href: '/blog'},
    {label: 'header.nav.about', href: '/about'},
    {label: 'header.nav.contact', href: '/contact'},
];

export default function Header() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [scrollbarWidth, setScrollbarWidth] = useState(0);
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    function handleToggleCart() {
        dispatch(toggleCart());
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 900) setOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 900) setOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const bodyPad = parseInt(document.body.style.paddingRight || '0', 10);
            setScrollbarWidth(bodyPad);
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
        return () => observer.disconnect();
    }, [])

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <header className="fixed top-0 left-0 right-0 z-50 flex flex-col"
                    style={{ paddingRight: scrollbarWidth }}

            >
                <SmallHeader/>

                <div className="bg-[#193028] border-b-1 border-[#374a43] shadow-sm">
                    <div className="max-w-6xl mx-auto px-4 h-16 grid md:grid-cols-3 grid-cols-2 items-center gap-6">
                        <Logo />

                        <nav className="hidden md:flex items-center justify-center gap-6 text-nowrap">
                            {NAV_LINKS.map(({label, href}) => (
                                <Link key={href} href={href} className="header-nav__link">
                                    {t(label)}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center justify-end gap-1">
                            <LanguageDropdown />

                            <IconButton size="small" sx={{color: '#ffffff'}}>
                                <User size={20} strokeWidth={1.5}/>
                            </IconButton>
                            <IconButton size="small" sx={{color: '#ffffff'}} onClick={handleToggleCart}>
                                <Badge badgeContent={0}>
                                    <ShoppingCart size={20} strokeWidth={1.5}/>
                                </Badge>
                            </IconButton>
                            <div className='flex md:hidden'>
                                <IconButton size="small" sx={{color: '#ffffff'}} ref={anchorRef} onClick={handleToggle}>
                                    {open ? <X size={20} strokeWidth={1.5}/> : <Menu size={20} strokeWidth={1.5}/>}
                                </IconButton>
                            </div>
                        </div>
                    </div>

                    {/* Only Mobile View */}
                    <Collapse in={open} timeout={300} unmountOnExit>
                        <Paper
                            elevation={3}
                            square
                            sx={{
                                background: 'white',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                width: '100%',
                            }}
                        >
                            <List disablePadding>
                                {NAV_LINKS.map(({label, href}) => (
                                    <ListItemButton
                                        key={href}
                                        component={Link}
                                        href={href}
                                        onClick={() => setOpen(false)}
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                                            '&:hover': {background: '#f8f9f8'},
                                        }}
                                    >
                                        <ListItemText
                                            primary={t(label)}
                                            primaryTypographyProps={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: '#08120C',
                                            }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Paper>
                    </Collapse>
                </div>
            </header>
        </ClickAwayListener>
    );
}
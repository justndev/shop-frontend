import {Typography} from "@mui/material";
import Link from "next/link";
import {ArrowRight} from "lucide-react";
import React from "react";

export function CategoryCard ({ image, href, text, comingSoon }: { image: string; href: string; text: string; comingSoon?: boolean }) {
    if (comingSoon) {
        return (
            <div className="flex flex-col gap-6 max-h-[300px] cursor-default">
                <div className="overflow-hidden rounded-lg aspect-[4/3] bg-[#08120C]">
                    <img
                        src={image}
                        alt={text}
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="flex items-center w-full justify-center gap-1">
                    <Typography variant={'body2'} style={{ fontWeight: 500, opacity: 0.4 }}>
                        {text}
                    </Typography>
                </div>
            </div>
        );
    }

    return (
        <Link href={href} className="group flex flex-col gap-6 max-h-[300px]">
            <div className="overflow-hidden rounded-lg aspect-[4/3] bg-[#08120C]">
                <img
                    src={image}
                    alt={text}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
            </div>
            <div className="flex items-center w-full justify-center gap-1">
                <Typography variant={'body2'} style={{fontWeight: 500}}>
                    {text}
                </Typography>
                <ArrowRight size={18} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1"/>
            </div>
        </Link>
    );
}

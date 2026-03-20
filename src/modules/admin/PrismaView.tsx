"use client";

import StudioWrapper from "@/src/modules/admin/StudioWrapper";
import Cookies from "js-cookie";
import {useEffect} from "react";

export default function PrismaView() {
    const token = Cookies.get('accessToken')
    const databaseUrl = `http://localhost:4000/database?token=${token}`
    useEffect(() => {
        console.log(Cookies);
    })
    return (
        <StudioWrapper>
            <iframe
                src={databaseUrl}
                className="w-full h-full border-none"
            />
        </StudioWrapper>
    );
}

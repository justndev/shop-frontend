"use client";

import StudioWrapper from "@/src/modules/admin/StudioWrapper";
import Cookies from "js-cookie";

export default function PrismaView() {
    const token = Cookies.get('accessToken')
    const databaseUrl = `http://localhost:4000/database?token=${token}`

    return (
        <StudioWrapper>
            <iframe
                src={databaseUrl}
                className="w-full h-full border-none"
            />
        </StudioWrapper>
    );
}

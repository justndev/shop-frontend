'use client'
// frontend/index.tsx
import { Studio } from "@prisma/studio-core/ui";
import { createPostgresAdapter } from "@prisma/studio-core/data/postgres-core";
import { createStudioBFFClient } from "@prisma/studio-core/data/bff";
import {useMemo} from "react";
import {Layout} from "lucide-react";
import PrismaView from "@/src/modules/admin/PrismaView";

export default function DatabasePage() {


    return (
        <PrismaView/>
    );
}
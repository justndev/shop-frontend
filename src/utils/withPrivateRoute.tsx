"use client";

import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import {useUserHook} from "@/src/lib/useUserHook";


export default function withPrivateRoute<T extends object>(Component: React.ComponentType<T>) {
    return function IsAuth(props: T) {
        const {user} = useUserHook();

        useEffect(() => {
            if (!user) {
                redirect("/login");
            }
        }, [user]);

        if (!user) {
            return null;
        }

        return <Component {...props} />;
    };
}

'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

import {useDispatch} from "react-redux";

import authApi from "@/src/modules/auth/authApi";
import {setUser} from "@/src/store/slices/userSlice";


export default function AuthCallback() {
    const router = useRouter();
    const params = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        async function doStuff() {
            const accessToken = params.get('accessToken')
            const refreshToken = params.get('refreshToken')
            const error = params.get('error')

            if (error || !accessToken || !refreshToken) {
                router.replace('/login?error=oauth_failed')
                return
            }

            Cookies.set('accessToken', accessToken);
            Cookies.set('refreshToken', refreshToken);

            const meRes = await authApi.getMe();
            dispatch(setUser(meRes.data));

            router.replace('/account');
        }
        doStuff()
    }, []);

    return <p>Signing you in...</p>;
}

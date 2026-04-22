import authApi from "@/src/modules/auth/authApi";

import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import {clearUser, setUser as setUserDispatch} from '@/src/store/slices/userSlice'

import {RootState} from "@/src/store";
import {User} from "@/src/utils/types";


export function useUserHook() {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user.user)

    function setUser(user: User) {
        dispatch(setUserDispatch(user))
    }

    async function handleLogout() {
        try {
            const refreshToken = authApi.getRefreshToken()
            if (refreshToken) await authApi.logout(refreshToken)
        } finally {
            authApi.clearTokens()
            router.replace("/")
            dispatch(clearUser())
        }
    }
    return {
        user,
        setUser,
        handleLogout
    }
}

'use client';

import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";

import userApi from "@/src/modules/profile/userApi";
import {setUser} from "@/src/store/slices/userSlice";
import {validatePassword, validateProfileInfo} from "@/src/utils/validations";

import {Alert} from "@/src/utils/types";
import {RootState} from "@/src/store";


export interface ProfileInfo {
    firstName?: string;
    lastName?: string;
    email: string;
}

export interface ProfileInfoErrors {
    firstName: string | null;
    lastName: string | null;
}

export interface PasswordFields {
    currentPassword: string;
    newPassword: string;
    repeatPassword: string;
}

export interface PasswordErrors {
    currentPassword: string | null;
    newPassword: string | null;
    repeatPassword: string | null;
}

export function useProfileHook() {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {user} = useSelector((state: RootState) => state.user);

    const [profile, setProfile] = useState<ProfileInfo>({
        firstName: user!.firstName,
        lastName: user!.lastName,
        email: user!.email,
    });

    const [profileErrors, setProfileErrors] = useState<ProfileInfoErrors>({
        firstName: null,
        lastName: null
    });

    const [profileLoading, setProfileLoading] = useState(false);
    const [profileAlert, setProfileAlert] = useState<Alert | null>();

    const [passwordFields, setPasswordFields] = useState<PasswordFields>({
        currentPassword: '',
        newPassword: '',
        repeatPassword: ''
    });

    const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({
        currentPassword: null,
        newPassword: null,
        repeatPassword: null
    });

    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordAlert, setPasswordAlert] = useState<Alert | null>();

    function handleChangeProfile(field: keyof ProfileInfo, value: string | boolean) {
        setProfileErrors(prevState => ({...prevState,
            firstName: null,
                lastName: null
        }))
        setProfile(prev => ({...prev, [field]: value}));
    }

    function handleChangePassword(field: keyof PasswordFields, value: string) {
        setPasswordFields(prev => ({...prev, [field]: value}));
    }

    async function handleSaveProfile() {
        setProfileAlert(null);
        setProfileLoading(true);

        const errors = validateProfileInfo(profile, t);
        setProfileErrors(errors);
        if (hasInfoErrors(errors)) {
            setProfileLoading(false);
            return
        };

        try {
            const res = await userApi.updateInfo(profile);
            if (res.data?.data) dispatch(setUser(res.data.data));
            setProfileAlert({type: 'success', message: t('account.profile.profile_updated')});

        } catch (err: any) {
            const key = `errors.${err.response.data?.details || 'could_not_update_profile'}`;
            setProfileAlert({type: 'error', message: t(key)});
        } finally {
            setProfileLoading(false);
        }
    }

    async function handleSavePassword() {
        setPasswordAlert(null);
        const errors = validatePassword(passwordFields, t);
        setPasswordErrors(errors);
        if (hasPasswordErrors(errors)) return;

        setPasswordLoading(true);
        try {
            await userApi.changePassword({
                currentPassword: passwordFields.currentPassword,
                newPassword: passwordFields.newPassword
            });
            setPasswordFields({currentPassword: '', newPassword: '', repeatPassword: ''});
            setPasswordAlert({type: 'success', message: t('account.profile.password_updated')});
        } catch (err: any) {
            const key = `errors.${err.response.data?.details || 'could_not_change_password'}`;
            setPasswordAlert({type: 'error', message: t(key)});
        } finally {
            setPasswordLoading(false);
        }
    }

    return {
        profile,
        profileErrors,
        profileLoading,
        handleChangeProfile,
        handleSaveProfile,
        profileAlert,

        passwordFields,
        passwordErrors,
        passwordLoading,
        handleChangePassword,
        handleSavePassword,
        passwordAlert
    };
}

function hasInfoErrors(e: ProfileInfoErrors) {
    return Object.values(e).some(v => v !== null);
}

function hasPasswordErrors(e: PasswordErrors) {
    return Object.values(e).some(v => v !== null);
}

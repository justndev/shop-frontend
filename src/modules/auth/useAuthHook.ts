'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next'
import {useDispatch} from "react-redux";

import { setUser, setInitialized, clearUser } from '@/src/store/slices/userSlice'
import authApi from '@/src/modules/auth/authApi'
import {LoginFields} from "@/src/modules/auth/useLoginHook";
import {validateEmail, validateLogin, validateNewPassword, validatePassword} from "@/src/utils/validations";


export interface AuthErrors {
  verifyEmail: string | null;
  verifyMagicLink: string | null;
  forgotPassword: string | null;
  resetPassword: string | null;
}

export interface AuthLoadings {
  verifyEmail: boolean;
  verifyMagicLink: boolean;
  forgotPassword: boolean;
  resetPassword: boolean;
}

export function useAuthHook() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { t } = useTranslation()

  const [errors, setErrors] = useState<AuthErrors>({verifyEmail: null, verifyMagicLink: null});
  const [loadings, setLoadings] = useState<AuthLoadings>({verifyEmail: false, verifyMagicLink: false});

  /**
   * @deprecated Move to a top-level AuthProvider. Called once on app mount.
   */
  async function initializeAuth() {
    if (!authApi.isAuthenticated()) {
      dispatch(setInitialized());
      return;
    }
    try {
      const res = await authApi.getMe();
      dispatch(setUser(res.data));
    } catch {
      authApi.clearTokens();
    } finally {
      dispatch(setInitialized());
    }
  }

  async function handleLogout() {
    const refreshToken = authApi.getRefreshToken();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } finally {
      authApi.clearTokens();
      dispatch(clearUser());
      router.push("/");
    }
  }

  async function handleVerifyEmail(token: string) {
    setLoadings(prev => ({ ...prev, verifyEmail: true }));

    try {
      const res = await authApi.verifyEmail(token);
      authApi.saveTokens(res.data);
      const meRes = await authApi.getMe();
      dispatch(setUser(meRes.data));
      router.push('/account');
    } catch (err: any) {
      const key = "errors." + (err.response?.data?.details || "email_verification_failed");
      setErrors(prev => ({ ...prev, verifyEmail: t(key) }));
    } finally {
      setLoadings(prev => ({ ...prev, verifyEmail: false }));
    }
  }

  function handleValidateEmail(email: string): boolean {
    const result = validateEmail(email, t);
    setErrors(prev => ({ ...prev, email: result }));
    return !result;
  }

  function handleValidatePassword(password: string): boolean {
    const result = validateNewPassword(password, t);
    setErrors(prev => ({ ...prev, email: result }));
    return !result;
  }

  async function handleForgotPassword(email: string) {
    setLoadings(prev => ({ ...prev, forgotPassword: true }));
    if (!handleValidateEmail(email)) return;

    try {
      await authApi.forgotPassword(email);
    } catch (err: any) {
      const key = "errors." + (err.response?.data?.details || "password_reset_request_failed");
      setErrors(prev => ({ ...prev, forgotPassword: t(key) }));
    } finally {
      setLoadings(prev => ({ ...prev, forgotPassword: false }));
    }
  }

  async function handleResetPassword(token: string, password: string) {
    setLoadings(prev => ({ ...prev, resetPassword: true }));
    if (!handleValidatePassword(password)) return;

    try {
      await authApi.resetPassword(token, password);
      router.push("/login");
    } catch (err: any) {
      const key = "errors." + (err.response?.data?.details || "password_reset_failed");
      setErrors(prev => ({ ...prev, resetPassword: t(key) }));
    } finally {
      setLoadings(prev => ({ ...prev, resetPassword: false }));
    }
  }

  async function handleVerifyMagicLink(token: string) {
    setLoadings(prev => ({ ...prev, verifyMagicLink: true }));

    try {
      const resData = await authApi.verifyMagicLink(token);
      authApi.saveTokens(resData.data);
      const meRes = await authApi.getMe();
      dispatch(setUser(meRes.data));
      router.push('/account');
    } catch (err: any) {
      const key = "errors." + (err.response?.data?.details || "magic_link_verification_failed");
      setErrors(prev => ({ ...prev, verifyMagicLink: t(key) }));
    } finally {
      setLoadings(prev => ({ ...prev, verifyMagicLink: false }));
    }
  }

  return {
    initializeAuth,
    handleLogout,
    handleVerifyEmail,
    handleForgotPassword,
    handleResetPassword,
    handleVerifyMagicLink,
    loadings,
    errors
  }
}

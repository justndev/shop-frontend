'use client'

import {useState} from 'react';

import {useTranslation} from 'react-i18next';
import {useLoginHook} from "@/src/modules/auth/useLoginHook";
import withPublicRoute from "@/src/utils/withPublicRoute";

import Link from "next/link";

import UnderlineButton from "@/src/shared/ui/buttons/UnderlineButton";
import DividerWithText from "@/src/shared/ui/DividerWithText";
import GoogleColorIcon from "@/src/shared/ui/GoogleColorIcon";

import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from '@mui/icons-material/Error';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Button, TextField, Typography, InputAdornment, IconButton, Alert} from "@mui/material";


export default withPublicRoute(LoginPage);
function LoginPage() {
    const {t} = useTranslation();
    const {loading, errors, loginAlert, handleLogin, handleLoginWithEmailLink} = useLoginHook();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await handleLogin({email, password})
    };

    const submitLoginWithEmailLink = async (e: React.FormEvent) => {
        e.preventDefault()
        await handleLoginWithEmailLink(email)
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit} className="auth-form">
                <Typography variant="h4" className="pb-2">{t("auth.login.enter_title")}</Typography>

                <TextField fullWidth label={t("auth.login.email")} type="email" value={email}
                           onChange={e => setEmail(e.target.value)}
                           error={!!errors.email} helperText={errors.email ?? ' '}/>

                <TextField fullWidth label={t("auth.login.password")}
                           type={showPass ? 'text' : 'password'} value={password}
                           onChange={e => setPassword(e.target.value)}
                           error={!!errors.password} helperText={errors.password ?? ' '}
                           InputProps={{
                               endAdornment: (
                                   <InputAdornment position="end">
                                       <IconButton onClick={() => setShowPass(p => !p)} edge="end">
                                           {showPass ? <VisibilityOff/> : <Visibility/>}
                                       </IconButton>
                                   </InputAdornment>
                               )
                           }}/>

                <div className="w-full flex justify-start -mt-3">
                    <UnderlineButton href="/forgot-password">{t("auth.login.forgot_password")}</UnderlineButton>
                </div>

                {loginAlert && (
                    <Alert
                        icon={loginAlert.type === 'error' ? <ErrorIcon fontSize="inherit" /> : <CheckIcon fontSize="inherit" />}
                        severity={loginAlert.type}
                        className="mt-3"
                    >
                        {loginAlert.message}
                    </Alert>
                )}


                <Button fullWidth type="submit" variant="contained" disabled={loading}
                        sx={{borderRadius: '999px', py: 1.5, textTransform: 'none', fontSize: '1rem'}}>
                    {t("auth.login.log_in")}
                </Button>

                <DividerWithText text={t("auth.login.or")}/>

                <Button fullWidth variant="contained" color='secondary' onClick={submitLoginWithEmailLink}
                        sx={{borderRadius: '999px', py: 1.5, textTransform: 'none', fontSize: '1rem'}}>
                    {t("auth.login.sign_in_with_email")}
                </Button>

                <Link href="http://localhost:4000/api/auth/google" className="w-full">
                    <Button fullWidth variant="outlined" startIcon={<GoogleColorIcon/>}
                            sx={{borderRadius: '999px', py: 1.5, mt: 1, textTransform: 'none', fontSize: '1rem'}}>
                        {t("auth.login.sign_in_google")}
                    </Button>
                </Link>

                <div className="w-full flex items-center justify-center gap-1">
                    <Typography>{t("auth.login.dont_have_account")}</Typography>
                    <UnderlineButton href="/register">{t("auth.login.create_account")}</UnderlineButton>
                </div>
            </form>
        </div>
    );
}

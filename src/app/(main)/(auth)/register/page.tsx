'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import withPublicRoute from "@/src/utils/withPublicRoute";
import {useRegisterHook} from "@/src/modules/auth/useRegisterHook";

import { Button, TextField, Typography, InputAdornment, IconButton, Alert } from "@mui/material";
import UnderlineButton from "@/src/shared/ui/buttons/UnderlineButton";
import DividerWithText from "@/src/shared/ui/DividerWithText";
import GoogleColorIcon from "@/src/shared/ui/GoogleColorIcon";
import Link from "next/link";

import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from "@mui/icons-material/Error";
import { Visibility, VisibilityOff } from "@mui/icons-material"
import config from "@/src/config";


const OAUTH_URL = config.BACKEND_API_URL + "/auth/google";

export default withPublicRoute(RegisterPage)
function RegisterPage() {
  const { t } = useTranslation()
  const { loading, errors, handleRegister, signupAlert} = useRegisterHook()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  function cleanForm() {
    setShowPass(false)
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleRegister({ email, password, firstName, lastName }, cleanForm)
  }

  return (
      <div className="auth-page">
        <form onSubmit={handleSubmit} className="auth-form">
          <Typography variant="h4" className="pb-2">{t("auth.register.title")}</Typography>

          <div className="w-full flex gap-3">
            <TextField fullWidth label={t("auth.register.first_name")} value={firstName}
                       onChange={e => setFirstName(e.target.value)}
                       error={!!errors.firstName} helperText={errors.firstName ?? t("auth.register.optional")} />
            <TextField fullWidth label={t("auth.register.last_name")} value={lastName}
                       onChange={e => setLastName(e.target.value)}
                       error={!!errors.lastName} helperText={errors.lastName ?? ' '} />
          </div>

          <TextField fullWidth label={t("auth.register.email")} type="email" value={email}
                     onChange={e => setEmail(e.target.value)}
                     error={!!errors.email} helperText={errors.email ?? ' '} />

          <TextField fullWidth label={t("auth.register.password")}
                     type={showPass ? 'text' : 'password'} value={password}
                     onChange={e => setPassword(e.target.value)}
                     error={!!errors.password} helperText={errors.password ?? ' '}
                     InputProps={{ endAdornment: (
                           <InputAdornment position="end">
                             <IconButton onClick={() => setShowPass(p => !p)} edge="end">
                               {showPass ? <VisibilityOff /> : <Visibility />}
                             </IconButton>
                           </InputAdornment>
                       )}} />


          {signupAlert && (
              <Alert
                  icon={signupAlert.type === 'error' ? <ErrorIcon fontSize="inherit" /> : <CheckIcon fontSize="inherit" />}
                  severity={signupAlert.type}
                  className="mt-3"
              >
                {signupAlert.message}
              </Alert>
          )}

          <Button fullWidth type="submit" variant="contained" disabled={loading}
                  sx={{ borderRadius: '999px', py: 1.5, textTransform: 'none', fontSize: '1rem' }}>
            {t("auth.register.create_account")}
          </Button>

          <DividerWithText text={t("auth.register.or")} />

          <Link href={OAUTH_URL} className="w-full">
            <Button fullWidth variant="outlined" startIcon={<GoogleColorIcon />}
                    sx={{ borderRadius: '999px', py: 1.5, textTransform: 'none', fontSize: '1rem' }}>
              {t("auth.register.sign_up_google")}
            </Button>
          </Link>

          <div className="w-full flex items-center justify-center gap-1">
            <Typography>{t("auth.register.have_account")}</Typography>
            <UnderlineButton href="/auth/login">{t("auth.register.log_in")}</UnderlineButton>
          </div>
        </form>
      </div>
  );
}

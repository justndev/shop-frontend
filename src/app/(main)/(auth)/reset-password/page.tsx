'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';

import withPublicRoute from "@/src/utils/withPublicRoute";
import { useAuthHook } from '@/src/modules/auth/useAuthHook';

import { Button, TextField, Typography, InputAdornment, IconButton, Alert } from "@mui/material";
import UnderlineButton from "@/src/shared/ui/buttons/UnderlineButton";
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from "@mui/icons-material/Error";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default withPublicRoute(ResetPasswordPage);
function ResetPasswordPage() {
  const { loadings, handleResetPassword } = useAuthHook();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);

  const passwordMismatch = !!confirm && confirm !== password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordMismatch) return;
    await handleResetPassword(token, password);
  };

  if (!token) {
    return (
        <div className="auth-page">
          <div className="backend-response-card">
            <Typography variant="h6" gutterBottom>{t("auth.reset_password.invalid_link")}</Typography>
            <UnderlineButton href="/auth/forgot-password">
              {t("auth.reset_password.request_new_link")}
            </UnderlineButton>
          </div>
        </div>
    );
  }

  return (
      <div className="auth-page">
        <form onSubmit={handleSubmit} className="auth-form">
          <Typography variant="h4" className="pb-2">{t("auth.reset_password.title")}</Typography>

          <TextField
              fullWidth
              label={t("auth.reset_password.new_password")}
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              helperText={t("auth.reset_password.min_chars")}
              inputProps={{ minLength: 6 }}
              InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(p => !p)} edge="end">
                        {showPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                )
              }}
          />

          <TextField
              fullWidth
              label={t("auth.reset_password.confirm_password")}
              type={showPass ? 'text' : 'password'}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              error={passwordMismatch}
              helperText={passwordMismatch ? t("auth.reset_password.passwords_mismatch") : ' '}
          />

          <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loadings.verifyEmail || passwordMismatch}
              sx={{ borderRadius: '999px', py: 1.5, textTransform: 'none', fontSize: '1rem' }}
          >
            {t("auth.reset_password.submit")}
          </Button>

          <div className="w-full flex items-center justify-center gap-1">
            <Typography>{t("auth.reset_password.remembered_password")}</Typography>
            <UnderlineButton href="/auth/login">{t("auth.reset_password.log_in")}</UnderlineButton>
          </div>
        </form>
      </div>
  );
}
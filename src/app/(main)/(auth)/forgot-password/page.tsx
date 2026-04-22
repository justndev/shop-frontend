'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import withPublicRoute from "@/src/utils/withPublicRoute";
import { useAuthHook } from '@/src/modules/auth/useAuthHook';

import { Button, TextField, Typography } from "@mui/material";
import UnderlineButton from "@/src/shared/ui/buttons/UnderlineButton";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';


export default withPublicRoute(ForgotPasswordPage);
function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { loadings, handleForgotPassword } = useAuthHook();

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleForgotPassword(email);
    setSent(true);
  };

  if (sent) {
    return (
        <div className="auth-page">
          <div className="auth-form">
            <EmailOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6" gutterBottom>{t("auth.forgot_password.sent_title")}</Typography>
            <Typography variant="body2" color="text.secondary" className="mb-4">
              {t("auth.forgot_password.sent_description")}
            </Typography>
            <UnderlineButton href="/auth/login">{t("auth.forgot_password.back_to_login")}</UnderlineButton>
          </div>
        </div>
    );
  }

  return (
      <div className="auth-page">
        <form onSubmit={handleSubmit} className="auth-form">
          <Typography variant="h4" className="pb-2">{t("auth.forgot_password.title")}</Typography>
          <Typography variant="body2" color="text.secondary" className="pb-2">
            {t("auth.forgot_password.description")}
          </Typography>

          <TextField
              fullWidth
              label={t("auth.forgot_password.email")}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              helperText=" "
          />

          <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loadings.forgotPassword}
              sx={{ borderRadius: '999px', py: 1.5, textTransform: 'none', fontSize: '1rem' }}
          >
            {t("auth.forgot_password.submit")}
          </Button>

          <div className="w-full flex items-center justify-center gap-1">
            <Typography>{t("auth.forgot_password.remembered_password")}</Typography>
            <UnderlineButton href="/auth/login">{t("auth.forgot_password.back_to_login")}</UnderlineButton>
          </div>
        </form>
      </div>
  );
}

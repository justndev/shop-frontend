'use client';

import { TextField, Checkbox, FormControlLabel } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import useCheckoutHook from "./useCheckout";
import { MUI_INPUT_SX } from "@/src/app/(main)/checkout/page";

type Props = Pick<
ReturnType<typeof useCheckoutHook>,
'user' | 'email' | 'setEmail' | 'newsletter' | 'setNewsletter'
| 'contactErrors'
>;

export default function ContactInfoSection({
                                               user, email, setEmail, newsletter, setNewsletter,
                                               contactErrors,
                                           }: Props) {
    const { t } = useTranslation();

    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-base text-[#1a1a14]">
                    {t('checkout.contact.title')}
                </h2>
                {!user && (
                    <Link href="/auth/login"
                          className="text-[0.85rem] text-[#1a3c2e] no-underline font-medium hover:underline font-['DM_Sans',sans-serif]">
                        {t('checkout.contact.sign_in')}
                    </Link>
                )}
            </div>

            <TextField
                fullWidth
                label={t('checkout.contact.email')}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={!!contactErrors.email}
                helperText={contactErrors.email ?? ''}
                sx={MUI_INPUT_SX}
            />

          {/*  <FormControlLabel*/}
          {/*      control={*/}
          {/*          <Checkbox checked={newsletter} onChange={e => setNewsletter(e.target.checked)}*/}
          {/*                    size="small" sx={{ color: '#c8c4bc', '&.Mui-checked': { color: '#1a3c2e' } }} />*/}
          {/*      }*/}
          {/*      label={*/}
          {/*          <span className="text-[0.85rem] text-[#4a4a42] font-['DM_Sans',sans-serif]">*/}
          {/*  {t('checkout.contact.newsletter')}*/}
          {/*</span>*/}
          {/*      }*/}
          {/*  />*/}
        </section>
    );
}
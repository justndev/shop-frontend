'use client';

import { MUI_INPUT_SX } from "@/src/app/(main)/checkout/page";
import { TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function PaymentSection() {
    const { t } = useTranslation();

    return (
        <section className="flex flex-col gap-3.5">
            <div>
                <h2 className="font-semibold text-base text-[#1a1a14] m-0 font-['DM_Sans',sans-serif]">
                    {t('checkout.payment.title')}
                </h2>
                <p className="text-[0.82rem] text-[#888880] mt-0.5 mb-0 font-['DM_Sans',sans-serif]">
                    {t('checkout.payment.subtitle')}
                </p>
            </div>

            <div className="border border-[#d8d4cc] border-[0.5px] rounded-lg overflow-hidden bg-white">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3.5 bg-[#f5f2ec] border-b border-b-[#e0ddd6] border-b-[0.5px]">
          <span className="text-[0.9rem] font-medium text-[#1a1a14] font-['DM_Sans',sans-serif]">
            {t('checkout.payment.credit_card')}
          </span>
                    <div className="flex gap-1.5 items-center">
                        <span className="text-[0.65rem] font-bold px-1.5 py-0.5 rounded bg-[#1a1f71] text-white tracking-[0.04em]">VISA</span>
                        <span className="text-[0.65rem] font-bold px-1.5 py-0.5 rounded bg-[#eb001b] text-white tracking-[0.04em]">MC</span>
                        <span className="text-[0.65rem] font-bold px-1.5 py-0.5 rounded bg-[#2e77bc] text-white tracking-[0.04em]">AMEX</span>
                    </div>
                </div>

                {/* Fields — no logic yet */}
                <div className="flex flex-col gap-3 p-4 bg-[#fafaf8]">
                    <TextField fullWidth label={t('checkout.payment.card_number')} inputProps={{ maxLength: 19 }} sx={MUI_INPUT_SX} />
                    <div className="grid grid-cols-2 gap-3">
                        <TextField fullWidth label={t('checkout.payment.expiry')} placeholder="MM / YY" sx={MUI_INPUT_SX} />
                        <TextField fullWidth label={t('checkout.payment.cvv')} sx={MUI_INPUT_SX} />
                    </div>
                    <TextField fullWidth label={t('checkout.payment.name_on_card')} sx={MUI_INPUT_SX} />
                    <FormControlLabel
                        control={
                            <Checkbox defaultChecked size="small"
                                      sx={{ color: '#c8c4bc', '&.Mui-checked': { color: '#1a3c2e' } }} />
                        }
                        label={
                            <span className="text-[0.85rem] text-[#4a4a42] font-['DM_Sans',sans-serif]">
                {t('checkout.payment.billing_same')}
              </span>
                        }
                    />
                </div>
            </div>
        </section>
    );
}
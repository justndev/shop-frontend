'use client';

import {MUI_INPUT_SX, MUI_SELECT_SX } from "@/src/app/(main)/checkout/page";
import { TextField, Checkbox, FormControlLabel, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useCheckoutHook, { COUNTRIES } from "./useCheckout";

type Props = Pick<ReturnType<typeof useCheckoutHook>,
| 'country'    | 'setCountry'
| 'firstName'  | 'setFirstName'
| 'lastName'   | 'setLastName'
| 'phone'      | 'setPhone'
| 'saveInfo'   | 'setSaveInfo'
| 'deliveryErrors'
>;

export default function DeliverySection(props: Props) {
    const { t } = useTranslation();
    const {
        country, setCountry,
        firstName, setFirstName, lastName, setLastName,
        phone, setPhone, saveInfo, setSaveInfo,
        deliveryErrors,
    } = props;

    return (
        <section className="flex flex-col gap-3.5">
            <h2 className="font-semibold text-base text-[#1a1a14] m-0 font-['DM_Sans',sans-serif]">
                {t('checkout.delivery.title')}
            </h2>

            {/* Country select */}
            <FormControl fullWidth error={!!deliveryErrors.country} sx={MUI_SELECT_SX}>
                <InputLabel>{t('checkout.delivery.country')}</InputLabel>
                <Select
                    value={country}
                    label={t('checkout.delivery.country')}
                    onChange={e => setCountry(e.target.value)}
                >
                    {COUNTRIES.map(c => (
                        <MenuItem key={c.code} value={c.code}
                                  sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
                            {t(c.labelKey)}
                        </MenuItem>
                    ))}
                </Select>
                {deliveryErrors.country && <FormHelperText>{deliveryErrors.country}</FormHelperText>}
            </FormControl>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
                <TextField
                    fullWidth label={t('checkout.delivery.first_name')}
                    value={firstName} onChange={e => setFirstName(e.target.value)}
                    error={!!deliveryErrors.firstName} helperText={deliveryErrors.firstName ?? ''}
                    sx={MUI_INPUT_SX}
                />
                <TextField
                    fullWidth label={t('checkout.delivery.last_name')}
                    value={lastName} onChange={e => setLastName(e.target.value)}
                    error={!!deliveryErrors.lastName} helperText={deliveryErrors.lastName ?? ''}
                    sx={MUI_INPUT_SX}
                />
            </div>

            <TextField
                fullWidth label={t('checkout.delivery.phone')}
                value={phone} onChange={e => setPhone(e.target.value)}
                error={!!deliveryErrors.phone} helperText={deliveryErrors.phone ?? ''}
                sx={MUI_INPUT_SX}
            />

          {/*  <FormControlLabel*/}
          {/*      control={*/}
          {/*          <Checkbox checked={saveInfo} onChange={e => setSaveInfo(e.target.checked)}*/}
          {/*                    size="small" sx={{ color: '#c8c4bc', '&.Mui-checked': { color: '#1a3c2e' } }} />*/}
          {/*      }*/}
          {/*      label={*/}
          {/*          <span className="text-[0.85rem] text-[#4a4a42] font-['DM_Sans',sans-serif]">*/}
          {/*  {t('checkout.delivery.save_info')}*/}
          {/*</span>*/}
          {/*      }*/}
          {/*  />*/}
        </section>
    );
}
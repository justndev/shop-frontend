'use client';

import { Radio, RadioGroup, Select, MenuItem, FormControl, InputLabel, TextField, FormHelperText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useCheckoutHook, {
    SHIPPING_METHODS, MOCK_CITIES, MOCK_PICKUP_POINTS,
} from './useCheckout';
import {MUI_INPUT_SX, MUI_SELECT_SX } from "@/src/app/(main)/checkout/page";

type Props = Pick<
ReturnType<typeof useCheckoutHook>,
| 'country'
| 'shippingMethodId' | 'handleSetShippingMethod' | 'selectedMethod'
| 'shippingCity'     | 'handleSetShippingCity'
| 'pickupPoint'      | 'setPickupPoint'
| 'address'          | 'setAddress'
| 'postalCode'       | 'setPostalCode'
| 'shippingErrors'
>;

const LogoBadge = ({ name }: { name?: string }) => {
    if (!name) return null;
    const styles: Record<string, string> = {
        smartpost: 'text-[#0057b8]',
        omniva:    'text-[#ff6600]',
    };
    return (
        <span className={`text-[0.7rem] font-bold tracking-wide uppercase ${styles[name] ?? 'text-[#888]'} font-['DM_Sans',sans-serif]`}>
      {name}
    </span>
    );
};

export default function ShippingMethodSection(props: Props) {
    const { t } = useTranslation();
    const {
        country,
        shippingMethodId, handleSetShippingMethod, selectedMethod,
        shippingCity, handleSetShippingCity,
        pickupPoint, setPickupPoint,
        address, setAddress,
        postalCode, setPostalCode,
        shippingErrors
    } = props;

    const cities       = MOCK_CITIES[country] ?? [];
    const pickupPoints = shippingCity ? (MOCK_PICKUP_POINTS[shippingCity] ?? []) : [];

    return (
        <section className="flex flex-col gap-0">
            <h2 className="font-semibold text-base text-[#1a1a14] m-0 mb-3.5 font-['DM_Sans',sans-serif]">
                {t('checkout.shipping.title')}
            </h2>

            {shippingErrors.method && (
                <p className="text-[0.78rem] text-[#d32f2f] font-['DM_Sans',sans-serif] m-0 mb-2">
                    {shippingErrors.method}
                </p>
            )}

            {/* Method list — each method is its own block with inline reveal */}
            <div className="flex flex-col">
                {SHIPPING_METHODS.map((method, index) => {
                    const isFirst    = index === 0;
                    const isLast     = index === SHIPPING_METHODS.length - 1;
                    const isSelected = shippingMethodId === method.id;
                    const isParcel   = method.type === 'parcel';
                    const isCourier  = method.type === 'courier';

                    return (
                        <div key={method.id}>
                            {/* ── Method row ── */}
                            <label
                                className={[
                                    'flex items-center gap-2.5 px-4 py-3.5 bg-white border-[0.5px] border-[#d8d4cc] cursor-pointer transition-colors duration-150',
                                    // Top radius only on the very first item (when not selected above it)
                                    isFirst ? 'rounded-t-lg' : '',
                                    // Bottom border: hide it when selected (reveal panel takes over) or when next item exists
                                    isSelected ? 'border-b-0' : (!isLast ? 'border-b-0' : 'border-b-[0.5px]'),
                                    // Bottom radius only on last item AND not selected (reveal panel has radius instead)
                                    isLast && !isSelected ? 'rounded-b-lg' : '',
                                    isSelected ? '!bg-[#f0f7f4] !border-[#1a3c2e]' : '',
                                ].join(' ')}
                            >
                                <Radio
                                    checked={isSelected}
                                    onChange={() => handleSetShippingMethod(method.id)}
                                    size="small"
                                    sx={{ color: '#c8c4bc', '&.Mui-checked': { color: '#1a3c2e' }, p: '6px' }}
                                />
                                <span className="flex-1 text-[0.9rem] text-[#1a1a14] font-['DM_Sans',sans-serif]">
                  {t(`checkout.shipping.methods.${method.id}`, { defaultValue: method.label })}
                                    {': '}
                                    <span className="font-semibold text-[#1a3c2e]">€{method.price.toFixed(2)}</span>
                </span>
                                <LogoBadge name={method.logo} />
                            </label>

                            {/* ── Inline reveal panel for PARCEL ── */}
                            {isSelected && isParcel && (
                                <div
                                    className={[
                                        'border-[0.5px] border-[#1a3c2e] border-t-0 bg-[#f7fbf9] px-4 py-4 flex flex-col gap-3',
                                        // Bottom radius: if last item, round bottom; otherwise next item connects
                                        isLast ? 'rounded-b-lg' : '',
                                        // Also round bottom if next item is not selected (visually the group ends here)
                                        'rounded-b-lg',
                                    ].join(' ')}
                                >
                                    <p className="text-[0.82rem] text-[#4a4a42] m-0 font-['DM_Sans',sans-serif]">
                                        {t('checkout.shipping.select_parcel_machine')}
                                    </p>

                                    <div className="flex gap-3">
                                        {/* City */}
                                        <FormControl fullWidth error={!!shippingErrors.city} sx={MUI_SELECT_SX}>
                                            <InputLabel sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
                                                {t('checkout.shipping.city')}
                                            </InputLabel>
                                            <Select
                                                value={shippingCity}
                                                label={t('checkout.shipping.city')}
                                                onChange={e => handleSetShippingCity(e.target.value)}
                                            >
                                                {cities.map(c => (
                                                    <MenuItem key={c} value={c}
                                                              sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
                                                        {c}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {shippingErrors.city && <FormHelperText>{shippingErrors.city}</FormHelperText>}
                                        </FormControl>

                                        {/* Pickup point — disabled until city chosen */}
                                        <FormControl
                                            fullWidth
                                            disabled={!shippingCity}
                                            error={!!shippingErrors.pickupPoint}
                                            sx={MUI_SELECT_SX}
                                        >
                                            <InputLabel sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
                                                {t('checkout.shipping.pickup_point')}
                                            </InputLabel>
                                            <Select
                                                value={pickupPoint}
                                                label={t('checkout.shipping.pickup_point')}
                                                onChange={e => setPickupPoint(e.target.value)}
                                                // Extra guard: MUI disabled prop on FormControl should suffice,
                                                // but we also block onChange explicitly
                                                inputProps={{ readOnly: !shippingCity }}
                                            >
                                                {pickupPoints.map(p => (
                                                    <MenuItem key={p} value={p}
                                                              sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
                                                        {p}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {shippingErrors.pickupPoint && (
                                                <FormHelperText>{shippingErrors.pickupPoint}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </div>
                                </div>
                            )}

                            {/* ── Inline reveal panel for COURIER ── */}
                            {isSelected && isCourier && (
                                <div className="border-[0.5px] border-[#1a3c2e] border-t-0 bg-[#f7fbf9] px-4 py-4 flex flex-col gap-3 rounded-b-lg">
                                    <p className="text-[0.82rem] text-[#4a4a42] m-0 font-['DM_Sans',sans-serif]">
                                        {t('checkout.shipping.enter_address')}
                                    </p>

                                    <TextField
                                        fullWidth label={t('checkout.delivery.address')}
                                        value={address} onChange={e => setAddress(e.target.value)}
                                        error={!!shippingErrors.address} helperText={shippingErrors.address ?? ''}
                                        sx={MUI_INPUT_SX}
                                    />

                                    <div className="grid grid-cols-2 gap-3">
                                        <TextField
                                            fullWidth label={t('checkout.shipping.city')}
                                            value={shippingCity} onChange={e => handleSetShippingCity(e.target.value)}
                                            error={!!shippingErrors.city} helperText={shippingErrors.city ?? ''}
                                            sx={MUI_INPUT_SX}
                                        />
                                        <TextField
                                            fullWidth label={t('checkout.delivery.postal_code')}
                                            value={postalCode} onChange={e => setPostalCode(e.target.value)}
                                            error={!!shippingErrors.postalCode} helperText={shippingErrors.postalCode ?? ''}
                                            sx={MUI_INPUT_SX}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Spacer between methods when this one is NOT selected, to reconnect borders */}
                            {!isSelected && !isFirst && index !== 0 && (
                                // No spacer needed — border-b-0 on prev + border-t on next merges them
                                null
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Radio,
    RadioGroup,
    Alert,
    Divider,
} from '@mui/material';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import '@/src/styles/checkout-page.css';

const MOCKED_ITEMS = [
    { id: 1, name: 'Aged Puerh Cake',         price: 48.00, quantity: 1, image: '/puerh-product.webp', variant: undefined },
    { id: 2, name: 'White Peony Loose Leaf',   price: 32.00, quantity: 2, image: '/puerh-product.webp', variant: '50g' },
];

const SHIPPING_METHODS = [
    { id: 'omniva',    label: 'Omniva parcel machine', price: 3.99 },
    { id: 'smartpost', label: 'SmartPost parcel machine', price: 3.49 },
];

const MUI_INPUT_SX = {
    '& .MuiOutlinedInput-root': {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.9rem',
        borderRadius: '8px',
        background: '#fff',
        '& fieldset': { borderColor: '#d8d4cc', borderWidth: '0.5px' },
        '&:hover fieldset': { borderColor: '#a8a49c' },
        '&.Mui-focused fieldset': { borderColor: '#1a3c2e', borderWidth: '1px' },
    },
    '& .MuiInputLabel-root': {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.9rem',
        color: '#888880',
        '&.Mui-focused': { color: '#1a3c2e' },
    },
};

export default function CheckoutPage() {
    const { t } = useTranslation();

    const [email, setEmail]           = useState('');
    const [newsletter, setNewsletter] = useState(false);
    const [firstName, setFirstName]   = useState('');
    const [lastName, setLastName]     = useState('');
    const [address, setAddress]       = useState('');
    const [apartment, setApartment]   = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity]             = useState('');
    const [phone, setPhone]           = useState('');
    const [saveInfo, setSaveInfo]     = useState(false);
    const [shipping, setShipping]     = useState('smartpost');
    const [discountCode, setDiscountCode] = useState('');

    const shippingCost = SHIPPING_METHODS.find(m => m.id === shipping)?.price ?? 0;
    const subtotal     = MOCKED_ITEMS.reduce((s, i) => s + i.price * i.quantity, 0);
    const total        = subtotal + shippingCost;
    const tax          = total * (22 / 122);

    return (
        <div className="checkout-page">

            {/* ── Left column ── */}
            <div className="checkout-left">

                {/* Contact */}
                <section className="checkout-section">
                    <div className="checkout-section__header">
                        <h2 className="checkout-section__title">{t('checkout.contact.title')}</h2>
                        <Link href="/src/app/(main)/(auth)/auth/login" className="checkout-section__link">
                            {t('checkout.contact.sign_in')}
                        </Link>
                    </div>

                    <TextField
                        fullWidth
                        label={t('checkout.contact.email')}
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        sx={MUI_INPUT_SX}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newsletter}
                                onChange={e => setNewsletter(e.target.checked)}
                                size="small"
                                sx={{ color: '#c8c4bc', '&.Mui-checked': { color: '#1a3c2e' } }}
                            />
                        }
                        label={
                            <span className="checkout-checkbox-label">
                                {t('checkout.contact.newsletter')}
                            </span>
                        }
                    />
                </section>

                {/* Delivery */}
                <section className="checkout-section">
                    <h2 className="checkout-section__title">{t('checkout.delivery.title')}</h2>

                    {/* Country — fixed to Estonia */}
                    <div className="checkout-country">
                        <span className="checkout-country__label">{t('checkout.delivery.country')}</span>
                        <span className="checkout-country__value">Estonia</span>
                    </div>

                    <div className="checkout-row">
                        <TextField
                            fullWidth
                            label={t('checkout.delivery.first_name')}
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            sx={MUI_INPUT_SX}
                        />
                        <TextField
                            fullWidth
                            label={t('checkout.delivery.last_name')}
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            sx={MUI_INPUT_SX}
                        />
                    </div>

                    <TextField
                        fullWidth
                        label={t('checkout.delivery.address')}
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        sx={MUI_INPUT_SX}
                    />

                    <TextField
                        fullWidth
                        label={t('checkout.delivery.apartment')}
                        value={apartment}
                        onChange={e => setApartment(e.target.value)}
                        sx={MUI_INPUT_SX}
                    />

                    <div className="checkout-row">
                        <TextField
                            fullWidth
                            label={t('checkout.delivery.postal_code')}
                            value={postalCode}
                            onChange={e => setPostalCode(e.target.value)}
                            sx={MUI_INPUT_SX}
                        />
                        <TextField
                            fullWidth
                            label={t('checkout.delivery.city')}
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            sx={MUI_INPUT_SX}
                        />
                    </div>

                    <TextField
                        fullWidth
                        label={t('checkout.delivery.phone')}
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        sx={MUI_INPUT_SX}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={saveInfo}
                                onChange={e => setSaveInfo(e.target.checked)}
                                size="small"
                                sx={{ color: '#c8c4bc', '&.Mui-checked': { color: '#1a3c2e' } }}
                            />
                        }
                        label={
                            <span className="checkout-checkbox-label">
                                {t('checkout.delivery.save_info')}
                            </span>
                        }
                    />
                </section>

                {/* Shipping method */}
                <section className="checkout-section">
                    <h2 className="checkout-section__title">{t('checkout.shipping.title')}</h2>

                    <RadioGroup value={shipping} onChange={e => setShipping(e.target.value)}>
                        {SHIPPING_METHODS.map((method, index) => (
                            <label
                                key={method.id}
                                className={`checkout-shipping-option ${shipping === method.id ? 'checkout-shipping-option--selected' : ''} ${index === 0 ? 'checkout-shipping-option--first' : ''} ${index === SHIPPING_METHODS.length - 1 ? 'checkout-shipping-option--last' : ''}`}
                            >
                                <Radio
                                    value={method.id}
                                    size="small"
                                    sx={{ color: '#c8c4bc', '&.Mui-checked': { color: '#1a3c2e' }, p: '6px' }}
                                />
                                <span className="checkout-shipping-option__label">{method.label}</span>
                                <span className="checkout-shipping-option__price">€{method.price.toFixed(2)}</span>
                            </label>
                        ))}
                    </RadioGroup>
                </section>

                {/* Payment */}
                <section className="checkout-section">
                    <div>
                        <h2 className="checkout-section__title">{t('checkout.payment.title')}</h2>
                        <p className="checkout-section__subtitle">{t('checkout.payment.subtitle')}</p>
                    </div>

                    <div className="checkout-payment-box">
                        <div className="checkout-payment-box__header">
                            <span className="checkout-payment-box__method">{t('checkout.payment.credit_card')}</span>
                            <div className="checkout-payment-cards">
                                <span className="checkout-card-badge checkout-card-badge--visa">VISA</span>
                                <span className="checkout-card-badge checkout-card-badge--mc">MC</span>
                                <span className="checkout-card-badge checkout-card-badge--amex">AMEX</span>
                            </div>
                        </div>

                        <div className="checkout-payment-fields">
                            <TextField
                                fullWidth
                                label={t('checkout.payment.card_number')}
                                inputProps={{ maxLength: 19 }}
                                sx={MUI_INPUT_SX}
                            />
                            <div className="checkout-row">
                                <TextField
                                    fullWidth
                                    label={t('checkout.payment.expiry')}
                                    placeholder="MM / YY"
                                    sx={MUI_INPUT_SX}
                                />
                                <TextField
                                    fullWidth
                                    label={t('checkout.payment.cvv')}
                                    sx={MUI_INPUT_SX}
                                />
                            </div>
                            <TextField
                                fullWidth
                                label={t('checkout.payment.name_on_card')}
                                sx={MUI_INPUT_SX}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        defaultChecked
                                        size="small"
                                        sx={{ color: '#c8c4bc', '&.Mui-checked': { color: '#1a3c2e' } }}
                                    />
                                }
                                label={
                                    <span className="checkout-checkbox-label">
                                        {t('checkout.payment.billing_same')}
                                    </span>
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* Pay button */}
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                        backgroundColor: '#1a3c2e',
                        color: '#fff',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: '1rem',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        borderRadius: '8px',
                        py: 1.75,
                        boxShadow: 'none',
                        '&:hover': { backgroundColor: '#2d5c46', boxShadow: 'none' },
                    }}
                >
                    {t('checkout.pay_now')}
                </Button>

                {/* Footer links */}
                <div className="checkout-footer-links">
                    <Link href="/src/app/(main)/(docs)/legal/returns" className="checkout-footer-link">{t('checkout.footer.refund_policy')}</Link>
                    <Link href="/src/app/(main)/(docs)/legal/terms" className="checkout-footer-link">{t('checkout.footer.terms_of_service')}</Link>
                    <Link href="/src/app/(main)/(docs)/legal/privacy" className="checkout-footer-link">{t('checkout.footer.privacy_policy')}</Link>
                    <Link href="/src/app/(main)/(docs)/legal/cookies" className="checkout-footer-link">{t('checkout.footer.cookie_policy')}</Link>
                </div>
            </div>

            {/* ── Right column — order summary ── */}
            <aside className="checkout-summary">

                {/* Items */}
                <div className="checkout-summary__items">
                    {MOCKED_ITEMS.map(item => (
                        <div key={item.id} className="checkout-summary__item">
                            <div className="checkout-summary__item-image-wrap">
                                <img src={item.image} alt={item.name} className="checkout-summary__item-image" />
                                <span className="checkout-summary__item-qty">{item.quantity}</span>
                            </div>
                            <div className="checkout-summary__item-info">
                                <p className="checkout-summary__item-name">{item.name}</p>
                                {item.variant && (
                                    <p className="checkout-summary__item-variant">{item.variant}</p>
                                )}
                            </div>
                            <p className="checkout-summary__item-price">
                                €{(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>

                <Divider sx={{ borderColor: '#e0ddd6' }} />

                {/* Discount code */}
                <div className="checkout-discount">
                    <TextField
                        fullWidth
                        size="small"
                        placeholder={t('checkout.summary.discount_placeholder')}
                        value={discountCode}
                        onChange={e => setDiscountCode(e.target.value)}
                        sx={{
                            ...MUI_INPUT_SX,
                            '& .MuiOutlinedInput-root': {
                                ...MUI_INPUT_SX['& .MuiOutlinedInput-root'],
                                fontSize: '0.85rem',
                            },
                        }}
                    />
                    <Button
                        variant="outlined"
                        sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            textTransform: 'none',
                            borderRadius: '8px',
                            borderColor: '#d8d4cc',
                            color: '#1a1a14',
                            whiteSpace: 'nowrap',
                            px: 2.5,
                            '&:hover': { borderColor: '#1a3c2e', color: '#1a3c2e', background: 'transparent' },
                        }}
                    >
                        {t('checkout.summary.apply')}
                    </Button>
                </div>

                <Divider sx={{ borderColor: '#e0ddd6' }} />

                {/* Totals */}
                <div className="checkout-summary__totals">
                    <div className="checkout-summary__row">
                        <span className="checkout-summary__row-label">{t('checkout.summary.subtotal')}</span>
                        <span className="checkout-summary__row-value">€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="checkout-summary__row">
                        <span className="checkout-summary__row-label">{t('checkout.summary.shipping')}</span>
                        <span className="checkout-summary__row-value">€{shippingCost.toFixed(2)}</span>
                    </div>
                </div>

                <Divider sx={{ borderColor: '#e0ddd6' }} />

                <div className="checkout-summary__total-row">
                    <span className="checkout-summary__total-label">{t('checkout.summary.total')}</span>
                    <span className="checkout-summary__total-value">
                        <span className="checkout-summary__currency">EUR</span>
                        €{total.toFixed(2)}
                    </span>
                </div>

                <p className="checkout-summary__tax-note">
                    {t('checkout.summary.tax_note', { amount: tax.toFixed(2) })}
                </p>

                <div className="checkout-summary__secure">
                    <ShieldCheck size={14} style={{ color: '#888880', flexShrink: 0 }} />
                    <span>{t('checkout.summary.secure')}</span>
                </div>
            </aside>
        </div>
    );
}
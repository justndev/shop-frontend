"use client"

import { PaymentMethod, PaymentMethodsResponse } from '@/src/api/paymentApi'

interface Props {
    methods: PaymentMethodsResponse
    selected: PaymentMethod | null
    onSelect: (m: PaymentMethod) => void
    activeCountry: string
    setActiveCountry: (c: string) => void
    banksByCountry: [string, PaymentMethod[]][]
    countryNames: Record<string, string>
    error?: string
}

const FLAG: Record<string, string> = { EE: '🇪🇪', LV: '🇱🇻', LT: '🇱🇹', EU: '🇪🇺' }

export default function PaymentMethodSelector({
                                                  methods, selected, onSelect,
                                                  activeCountry, setActiveCountry,
                                                  banksByCountry, countryNames, error,
                                              }: Props) {

    const isSelected = (m: PaymentMethod) => selected?.name === m.name

    const MethodBtn = ({ method }: { method: PaymentMethod }) => (
        <button
            onClick={() => onSelect(method)}
            type="button"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 8px',
                border: `2px solid ${isSelected(method) ? '#E8181A' : '#e5e7eb'}`,
                borderRadius: 10,
                background: isSelected(method) ? '#fff5f5' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.15s',
                minHeight: 72,
                width: '100%',
            }}
        >
            <img
                src={method.logo_url}
                alt={method.display_name}
                style={{ height: 28, objectFit: 'contain', maxWidth: 80 }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <span style={{ fontSize: 11, color: '#374151', fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>
        {method.display_name}
      </span>
        </button>
    )

    return (
        <div>
            {/* ── Bank transfers ───────────────────────────────────────────────── */}
            {banksByCountry.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                        🏦 Банковский перевод
                    </div>

                    {/* Country tabs */}
                    {banksByCountry.length > 1 && (
                        <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                            {banksByCountry.map(([country]) => (
                                <button
                                    key={country}
                                    onClick={() => setActiveCountry(country)}
                                    type="button"
                                    style={{
                                        padding: '4px 12px',
                                        borderRadius: 20,
                                        border: `1px solid ${activeCountry === country ? '#E8181A' : '#e5e7eb'}`,
                                        background: activeCountry === country ? '#E8181A' : '#fff',
                                        color: activeCountry === country ? '#fff' : '#374151',
                                        fontSize: 12,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    {countryNames[country] || country}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Bank logos grid */}
                    {banksByCountry
                        .filter(([country]) => country === activeCountry)
                        .map(([, banks]) => (
                            <div key={activeCountry} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 8 }}>
                                {banks.map(m => <MethodBtn key={m.name} method={m} />)}
                            </div>
                        ))
                    }
                </div>
            )}

            {/* ── Card payments ────────────────────────────────────────────────── */}
            {methods.cards.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                        💳 Банковская карта
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 8 }}>
                        {methods.cards.map(m => <MethodBtn key={m.name} method={m} />)}
                    </div>
                </div>
            )}

            {/* ── Pay later ────────────────────────────────────────────────────── */}
            {methods.payLater.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                        🕐 Оплата позже / рассрочка
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
                        {methods.payLater.map(m => <MethodBtn key={m.name} method={m} />)}
                    </div>
                </div>
            )}

            {error && (
                <p style={{ color: '#E8181A', fontSize: 12, marginTop: 8, fontWeight: 500 }}>{error}</p>
            )}

            {selected && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="#16a34a"><circle cx="8" cy="8" r="8"/><polyline points="4,8 7,11 12,5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                    <span style={{ fontSize: 13, color: '#166534', fontWeight: 600 }}>
            Выбран: {selected.display_name}
          </span>
                </div>
            )}
        </div>
    )
}
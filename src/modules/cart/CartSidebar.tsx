'use client';

import { useTranslation } from 'react-i18next';
import { Drawer, IconButton, Divider, Button } from '@mui/material';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

const MOCKED_ITEMS: CartItem[] = [
  {
    id: 1,
    name: 'Aged Puerh Cake',
    price: 48.00,
    quantity: 1,
    image: '/puerh-product.webp',
  },
  {
    id: 2,
    name: 'White Peony Loose Leaf',
    price: 32.00,
    quantity: 2,
    image: '/puerh-product.webp',
    variant: '50g',
  },
  {
    id: 3,
    name: 'Celadon Gaiwan Set',
    price: 120.00,
    quantity: 1,
    image: '/puerh-product.webp',
  },
];

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { t } = useTranslation();
  const [items, setItems] = useState<CartItem[]>(MOCKED_ITEMS);

  const updateQty = (id: number, delta: number) => {
    setItems(prev =>
        prev
            .map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
            .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
      <Drawer
          anchor="right"
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: {
              width: { xs: '100vw', sm: 420 },
              background: '#faf9f7',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '0.5px solid #d8d4cc',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.08)',
            },
          }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '0.5px solid #e0ddd6',
        }}>
          <div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: '1.15rem',
              color: '#1a1a14',
              margin: 0,
              letterSpacing: '-0.01em',
            }}>
              {t('cart.title')}
            </p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.8rem',
              color: '#888880',
              margin: '2px 0 0',
            }}>
              {items.length} {items.length === 1
                ? t('cart.item', 'item')
                : t('cart.items', 'items')}
            </p>
          </div>
          <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: '#4a4a42',
                '&:hover': { background: '#f0ede6' },
              }}
          >
            <X size={20} />
          </IconButton>
        </div>

        {/* Column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          padding: '10px 24px',
          borderBottom: '0.5px solid #e0ddd6',
        }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#888880',
                }}>
                    {t('cart.col_product', 'Product')}
                </span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#888880',
          }}>
                    {t('cart.col_total', 'Total')}
                </span>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {items.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '48px 24px',
                gap: 12,
              }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.95rem',
                  color: '#888880',
                  margin: 0,
                  textAlign: 'center',
                }}>
                  {t('cart.empty', 'Your cart is empty.')}
                </p>
              </div>
          ) : (
              items.map((item, index) => (
                  <div key={item.id}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '72px 1fr auto',
                      gap: 16,
                      padding: '16px 24px',
                      alignItems: 'start',
                    }}>
                      {/* Image */}
                      <div style={{
                        width: 72,
                        height: 72,
                        background: '#ffffff',
                        border: '0.5px solid #e0ddd6',
                        borderRadius: 8,
                        overflow: 'hidden',
                        flexShrink: 0,
                        position: 'relative',
                      }}>
                        <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                        />
                      </div>

                      {/* Info + qty controls */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 500,
                          fontSize: '0.9rem',
                          color: '#1a1a14',
                          margin: 0,
                          lineHeight: 1.3,
                        }}>
                          {item.name}
                        </p>

                        {item.variant && (
                            <p style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: '0.78rem',
                              color: '#888880',
                              margin: 0,
                            }}>
                              {item.variant}
                            </p>
                        )}

                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '0.82rem',
                          color: '#6b6b5e',
                          margin: 0,
                        }}>
                          {item.price.toFixed(2)}€
                        </p>

                        {/* Qty stepper */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '0.5px solid #d8d4cc',
                          borderRadius: 6,
                          overflow: 'hidden',
                          width: 'fit-content',
                          background: '#fff',
                        }}>
                          <button
                              onClick={() => updateQty(item.id, -1)}
                              style={{
                                width: 32,
                                height: 32,
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#4a4a42',
                                transition: 'background 0.15s',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#f5f2ec')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Minus size={13} />
                          </button>

                          <span style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: '#1a1a14',
                            minWidth: 28,
                            textAlign: 'center',
                            borderLeft: '0.5px solid #e0ddd6',
                            borderRight: '0.5px solid #e0ddd6',
                            lineHeight: '32px',
                          }}>
                                            {item.quantity}
                                        </span>

                          <button
                              onClick={() => updateQty(item.id, 1)}
                              style={{
                                width: 32,
                                height: 32,
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#4a4a42',
                                transition: 'background 0.15s',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#f5f2ec')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Line total + remove */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: 8,
                      }}>
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: '#1a3c2e',
                          margin: 0,
                          whiteSpace: 'nowrap',
                        }}>
                          {(item.price * item.quantity).toFixed(2)}€
                        </p>

                        <IconButton
                            onClick={() => removeItem(item.id)}
                            size="small"
                            sx={{
                              color: '#b0a898',
                              p: '4px',
                              '&:hover': { color: '#c0392b', background: 'transparent' },
                            }}
                        >
                          <Trash2 size={15} />
                        </IconButton>
                      </div>
                    </div>

                    {index < items.length - 1 && (
                        <Divider sx={{ borderColor: '#f0ede6', mx: '24px' }} />
                    )}
                  </div>
              ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
            <div style={{
              borderTop: '0.5px solid #e0ddd6',
              padding: '20px 24px 24px',
              background: '#faf9f7',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              {/* Estimated total */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 4,
                }}>
                            <span style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontWeight: 500,
                              fontSize: '0.95rem',
                              color: '#1a1a14',
                            }}>
                                {t('cart.estimated_total', 'Estimated total')}
                            </span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: '#1a3c2e',
                    letterSpacing: '-0.01em',
                  }}>
                                €{total.toFixed(2)}
                            </span>
                </div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.75rem',
                  color: '#888880',
                  margin: 0,
                  lineHeight: 1.5,
                }}>
                  {t('cart.tax_note', 'Tax included. Shipping calculated at checkout.')}
                </p>
              </div>

              {/* Checkout button */}
              <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: '#1a3c2e',
                    color: '#fff',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    borderRadius: '8px',
                    py: 1.5,
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#2d5c46',
                      boxShadow: 'none',
                    },
                  }}
              >
                {t('cart.proceed_to_payment', 'Proceed to payment')}
              </Button>
            </div>
        )}
      </Drawer>
  );
}
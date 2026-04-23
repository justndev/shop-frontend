'use client';

import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from 'react-i18next';
import {removeItem, toggleCart, updateQuantity} from "@/src/store/slices/cartSlice";
import {getThumbnailUrl} from "@/src/utils/functions";
import {Drawer, IconButton, Divider, Button} from '@mui/material';
import {X, Trash2, Plus, Minus} from 'lucide-react';
import {RootState} from "@/src/store";
import {useEffect, useRef} from "react";
import useCartHook from "@/src/modules/cart/useCartHook";

export default function CartSidebar() {
  const {t, i18n} = useTranslation();

  const {
    items,
    handleToggleShowCart,
    handleCloseCart,
    handleAddItem,
    handleRemoveItem,
    handleUpdateQuantity,
    handleClearCart,
    isOpen,
  } = useCartHook();

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
      <Drawer
          anchor="right"
          open={isOpen}
          onClose={handleCloseCart}
          PaperProps={{
            sx: {
              width: {xs: '100vw', sm: 420},
              background: 'var(--beige)',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '0.5px solid var(--beige-dark)',
            },
          }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-grey">
          <div>
            <p className="font-bold text-[1.15rem] text-[#1a1a14] m-0 tracking-[-0.01em]"
               style={{fontFamily: "'DM Sans', sans-serif"}}>
              {t('cart.title')}
            </p>
            <p className="text-[0.8rem] text-(--beige-grey) m-0 mt-[2px]"
               style={{fontFamily: "'DM Sans', sans-serif"}}>
              {items.length} {items.length === 1 ? t('cart.item') : t('cart.items')}
            </p>
          </div>
          <IconButton
              onClick={handleToggleShowCart}
              size="small"
          >
            <X size={20}/>
          </IconButton>
        </div>

        {/* Column headers */}
        <div className="grid px-6 py-[10px] border-b border-grey" style={{gridTemplateColumns: '1fr auto'}}>
                <a className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-(--beige-grey)"
                      style={{fontFamily: "'DM Sans', sans-serif"}}>
                    {t('cart.col_product')}
                </a>
          <span className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-(--beige-grey)"
                style={{fontFamily: "'DM Sans', sans-serif"}}>
                    {t('cart.col_total')}
                </span>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 py-12 gap-3">
                <p className="text-[0.95rem] text-(--beige-grey) m-0 text-center"
                   style={{fontFamily: "'DM Sans', sans-serif"}}>
                  {t('cart.empty')}
                </p>
              </div>
          ) : (
              items.map((item, index) => (
                  <div key={item.product.id}>
                    <div className="grid gap-4 px-6 py-4 items-start"
                         style={{gridTemplateColumns: '72px 1fr auto'}}>

                      {/* Image */}
                      <div className="w-[72px] h-[72px] bg-white border border-[#e0ddd6] rounded-lg overflow-hidden flex-shrink-0 relative">
                        <img
                            src={getThumbnailUrl(item.product.images[0])}
                            alt={item.product.name[i18n.language]}
                            className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info + qty controls */}
                      <div className="flex flex-col gap-2">
                        <p className="font-medium text-[0.9rem] text-[#1a1a14] m-0 leading-[1.3]"
                           style={{fontFamily: "'DM Sans', sans-serif"}}>
                          {item.product.name[i18n.language]}
                        </p>

                        <p className="text-[0.82rem] text-[#6b6b5e] m-0"
                           style={{fontFamily: "'DM Sans', sans-serif"}}>
                          {item.product.price}€
                        </p>

                        {/* Qty stepper */}
                        <div className="inline-flex items-center border border-[#d8d4cc] rounded-md overflow-hidden w-fit bg-white">
                          <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 border-none bg-transparent cursor-pointer flex items-center justify-center text-[#4a4a42] transition-colors duration-150 hover:bg-[#f5f2ec]"
                          >
                            <Minus size={13}/>
                          </button>

                          <span
                              className="text-[0.85rem] font-medium text-[#1a1a14] min-w-[28px] text-center border-l border-r border-[#e0ddd6] leading-8"
                              style={{fontFamily: "'DM Sans', sans-serif"}}>
                                            {item.quantity}
                                        </span>

                          <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 border-none bg-transparent cursor-pointer flex items-center justify-center text-[#4a4a42] transition-colors duration-150 hover:bg-[#f5f2ec]"
                          >
                            <Plus size={13}/>
                          </button>
                        </div>
                      </div>

                      {/* Line total + remove */}
                      <div className="flex flex-col items-end gap-2">
                        <p className="font-bold text-[0.95rem] text-[#1a3c2e] m-0 whitespace-nowrap"
                           style={{fontFamily: "'DM Sans', sans-serif"}}>
                          {(item.product.price * item.quantity).toFixed(2)}€
                        </p>
                        <IconButton
                            onClick={() => removeItem(item.product.id)}
                            size="small"
                            sx={{
                              color: '#b0a898',
                              p: '4px',
                              '&:hover': {color: '#c0392b', background: 'transparent'},
                            }}
                        >
                          <Trash2 size={15}/>
                        </IconButton>
                      </div>
                    </div>

                    {index < items.length - 1 && (
                        <Divider sx={{borderColor: '#f0ede6', mx: '24px'}}/>
                    )}
                  </div>
              ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
            <div className="border-t border-[#e0ddd6] px-6 pt-5 pb-6 bg-[#faf9f7] flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-baseline mb-1">
                            <span className="font-medium text-[0.95rem] text-[#1a1a14]"
                                  style={{fontFamily: "'DM Sans', sans-serif"}}>
                                {t('cart.estimated_total')}
                            </span>
                  <span className="font-bold text-[1.2rem] text-[#1a3c2e] tracking-[-0.01em]"
                        style={{fontFamily: "'DM Sans', sans-serif"}}>
                                €{total.toFixed(2)}
                            </span>
                </div>
                <p className="text-[0.75rem] text-(--beige-grey) m-0 leading-[1.5]"
                   style={{fontFamily: "'DM Sans', sans-serif"}}>
                  {t('cart.tax_note')}
                </p>
              </div>

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
                    '&:hover': {backgroundColor: '#2d5c46', boxShadow: 'none'},
                  }}
              >
                {t('cart.proceed_to_payment')}
              </Button>
            </div>
        )}
      </Drawer>
  );
}
'use client';

import { useTranslation } from 'react-i18next';
import { Banklink, Card } from "@/src/modules/checkout/paymentApi";
import {PaymentSectionErrors} from "@/src/utils/validations";

type Props = {
    paymentCards: Card[];
    paymentBanks: Banklink[];
    selected: string | null;
    onSelect: (method: string) => void;
    paymentErrors: PaymentSectionErrors;
};

export default function PaymentSection({
                                           paymentCards,
                                           paymentBanks,
                                           selected,
                                           onSelect,
                                           paymentErrors
                                       }: Props) {
    const { t } = useTranslation();

    const renderOption = (
        name: string,
        label: string,
        logo: string
    ) => {
        const isSelected = selected === name;

        return (
            <button
                key={name}
                type="button"
                onClick={() => onSelect(name)}
                className={`flex items-center gap-3 w-full border rounded-lg px-3 py-2 transition
                    ${isSelected
                    ? 'border-[#1a3c2e] bg-[#f3f6f4]'
                    : 'border-[#d8d4cc] bg-white hover:border-[#bdb8ae]'
                }`}
            >
                <img src={logo} alt={label} className="h-5 object-contain" />
                <span className="text-sm text-[#1a1a14] font-medium">
                    {label}
                </span>
            </button>
        );
    };

    return (
        <section className="flex flex-col gap-3.5">
            {/* Title */}
            <div>
                <h2 className="font-semibold text-base text-[#1a1a14] m-0 font-['DM_Sans',sans-serif]">
                    {t('checkout.payment.title')}
                </h2>
                <p className="text-[0.82rem] text-[#888880] mt-0.5 mb-0 font-['DM_Sans',sans-serif]">
                    {t('checkout.payment.subtitle')}
                </p>
            </div>
            {paymentErrors.general && (
                <p className="text-[0.78rem] text-[#d32f2f] font-['DM_Sans',sans-serif] m-0 mb-2">
                    {paymentErrors.general}
                </p>
            )}
            {/* Cards */}
            {paymentCards.length > 0 && (
                <div className="border border-[#d8d4cc] border-[0.5px] rounded-lg overflow-hidden bg-white">
                    <div className="px-4 py-3 bg-[#f5f2ec] border-b border-[#e0ddd6]">
                        <span className="text-[0.9rem] font-medium text-[#1a1a14]">
                            {t('checkout.payment.card')}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 p-4 bg-[#fafaf8]">
                        {paymentCards.map(card =>
                            renderOption(
                                card.name,
                                card.display_name,
                                card.logo_url
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Banklinks */}
            {paymentBanks.length > 0 && (
                <div className="border border-[#d8d4cc] border-[0.5px] rounded-lg overflow-hidden bg-white">
                    <div className="px-4 py-3 bg-[#f5f2ec] border-b border-[#e0ddd6]">
                        <span className="text-[0.9rem] font-medium text-[#1a1a14]">
                            {t('checkout.payment.bank')}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-4 bg-[#fafaf8]">
                        {paymentBanks.map(bank =>
                            renderOption(
                                bank.name,
                                bank.display_name,
                                bank.logo_url
                            )
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
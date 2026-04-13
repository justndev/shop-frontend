'use client';

import Link from 'next/link';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const QUICK_LINKS = [
  { label: 'Organic CBD wholesaler', href: '/organic-cbd-wholesaler' },
  { label: 'Wholesaler CBD Belgium', href: '/wholesaler-cbd-belgium' },
  { label: 'Wholesaler CBD Spain', href: '/wholesaler-cbd-spain' },
  { label: 'Wholesale CBD Luxembourg', href: '/wholesale-cbd-luxembourg' },
  { label: 'Wholesale CBD Switzerland', href: '/wholesale-cbd-switzerland' },
  { label: 'Wholesaler CBD Malta', href: '/wholesaler-cbd-malta' },
  { label: 'Affiliate program', href: '/affiliate-program' },
];

const INFORMATION_LINKS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Who are we?', href: '/about' },
  { label: 'Loyalty program', href: '/loyalty' },
  { label: 'Gifts from the Wholesaler', href: '/gifts' },
  { label: 'CBD in Tobacco Offices', href: '/cbd-tobacco' },
  { label: 'Shipping & Return Policy', href: '/shipping' },
  { label: 'Legal Notice', href: '/legal' },
  { label: 'Use & Privacy', href: '/privacy' },
  { label: 'Sponsorship', href: '/sponsorship' },
];

export default function Footer() {
  return (
      <footer className="footer">
        <div className="footer__inner">
          {/* Quick Links */}
          <div className="footer__col">
            <Typography className="footer__heading">Quick links</Typography>
            <ul className="footer__list">
              {QUICK_LINKS.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer__link">{link.label}</Link>
                  </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div className="footer__col">
            <Typography className="footer__heading">Information</Typography>
            <ul className="footer__list">
              {INFORMATION_LINKS.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer__link">{link.label}</Link>
                  </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <Typography className="footer__heading">Contact</Typography>
            <ul className="footer__list">
              <li>
                <Typography className="footer__text">01.88.81.21.99</Typography>
              </li>
              <li>
                <a href="mailto:contact@mamakana.com" className="footer__link footer__link--underline">
                  contact@mamakana.com
                </a>
              </li>
              <li className="footer__contact-note">
                <Typography className="footer__text">
                  If you have any questions or special requirements, please don't hesitate to contact us by e-mail at{' '}
                  <a href="mailto:contact@mamakana.com" className="footer__link footer__link--underline">
                    contact@mamakana.com
                  </a>
                </Typography>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <Typography className="footer__bottom-text">
            © {new Date().getFullYear()} MAMA KANA. All rights reserved.
          </Typography>
        </div>

        <style jsx>{`
                .footer {
                    background-color: #0e2218;
                    color: #c8d5ce;
                    width: 100%;
                    position: relative;

                }

                .footer__inner {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 56px 48px 48px;
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 48px;
                }

                .footer__heading {
                    font-size: 1rem !important;
                    font-weight: 700 !important;
                    color: #ffffff !important;
                    margin-bottom: 20px !important;
                    letter-spacing: 0.01em;
                }

                .footer__list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .footer__link {
                    color: #9ab5a8;
                    text-decoration: none;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    transition: color 0.2s ease;
                }

                .footer__link:hover {
                    color: #ffffff;
                }

                .footer__link--underline {
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }

                .footer__text {
                    color: #9ab5a8 !important;
                    font-size: 0.875rem !important;
                    line-height: 1.6 !important;
                }

                .footer__contact-note {
                    margin-top: 12px;
                }

                .footer__bottom {
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 20px 48px;
                }

                .footer__bottom-text {
                    color: #5a7a6a !important;
                    font-size: 0.8rem !important;
                }

                @media (max-width: 900px) {
                    .footer__inner {
                        grid-template-columns: 1fr 1fr;
                        padding: 40px 24px 32px;
                        gap: 36px;
                    }

                    .footer__bottom {
                        padding: 16px 24px;
                    }
                }

                @media (max-width: 580px) {
                    .footer__inner {
                        grid-template-columns: 1fr;
                        padding: 32px 20px 24px;
                        gap: 32px;
                    }

                    .footer__bottom {
                        padding: 16px 20px;
                    }
                }
            `}</style>
      </footer>
  );
}
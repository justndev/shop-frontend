import {Breadcrumbs} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";
import {useTranslation} from "react-i18next";
import {Product} from "@/src/types";

interface BreadcrumbNavProps {
    product: Product;
}

export default function BreadcrumbNav({product}: BreadcrumbNavProps) {
    const {t, i18n} = useTranslation();

    return (
        <div className="px-8 py-3 border-b mt-11" style={{borderColor: 'var(--border)', background: 'white'}}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                <Link href="/" className="text-sm no-underline" style={{color: 'var(--muted)'}}>{t('general.home')}</Link>
                <Link href={`/category/${product.category.slug}`} className="text-sm no-underline"
                      style={{color: 'var(--muted)'}}>
                    {product.category.name[i18n.language]}
                </Link>
                <span className="text-sm" style={{color: 'var(--ink)'}}>{product.name[i18n.language]}</span>
            </Breadcrumbs>
        </div>
    )
}
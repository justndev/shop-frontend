import {Typography} from "@mui/material";
import {Trans, useTranslation} from "react-i18next";
import ProductCarousel from "@/src/modules/landing/productCarousel/ProductCarousel";



export default function OurProducts() {
    const { t } = useTranslation();

    return (
        <section className='w-full flex flex-col overflow-hidden'> {/* overflow-hidden clips the carousel sides */}

            {/* Wrapper/Limiter */}
            <div className="relative w-full max-w-375 flex flex-col items-center gap-4 py-8 self-center">

                {/* Title */}
                <div className="w-full px-8">
                    <Typography variant="h2" className="text-[#193028] mb-15 leading-snug" sx={{fontWeight: 400}}>
                        <Trans i18nKey="our_products.title" components={{ b: <strong /> }} />
                    </Typography>
                </div>

                {/* Paragraphs */}
                <div className="px-8">
                    <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.8 }}>
                        <Trans i18nKey="expertise.paragraph1" components={{ b: <strong style={{ color: '#08120C' }} /> }} />
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.8 }}>
                        <Trans i18nKey="expertise.paragraph2" components={{ b: <strong style={{ color: '#08120C' }} /> }} />
                    </Typography>
                </div>

                {/* Carousel — anchored to max-w limiter but bleeds right */}
                <div className="w-full">
                    <ProductCarousel />
                </div>
            </div>

        </section>
    )
}
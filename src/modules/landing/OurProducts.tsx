import {Typography} from "@mui/material";
import {Trans, useTranslation} from "react-i18next";
import ProductCarousel from "@/src/modules/landing/productCarousel/ProductCarousel";



export default function OurProducts() {
    const { t } = useTranslation();

    return (
        <section className='w-full flex justify-center'>

            {/* Wrapper/Limiter */}
            <div className="relative w-full max-w-375 flex flex-col items-center gap-4 py-8">

                {/* Title */}
                <div className="w-full px-8">
                    <Typography variant="h2" className="text-[#193028] mb-15 leading-snug" sx={{fontWeight: 400}}>
                        <Trans i18nKey="our_products.title" components={{ b: <strong /> }} />
                    </Typography>
                </div>

                {/* Centred paragraph with bold highlights */}
                <div className="px-8">
                    <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.8 }}>
                        <Trans
                            i18nKey="expertise.paragraph1"
                            components={{ b: <strong style={{ color: '#08120C' }} /> }}
                        />
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.8 }}>
                        <Trans
                            i18nKey="expertise.paragraph2"
                            components={{ b: <strong style={{ color: '#08120C' }} /> }}
                        />
                    </Typography>
                </div>
                {/* Carousel — full width within the section */}
                <div className="w-full">
                    <ProductCarousel />
                </div>


                <div className="max-w-375 mx-auto flex items-stretch justify-center gap-0 md:flex-row flex-col">
                </div>
            </div>
        </section>

    )
}
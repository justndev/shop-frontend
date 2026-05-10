'use client';

import React, {useEffect, useState} from "react";
import {Trans, useTranslation} from "react-i18next";

import productApi from "@/src/lib/productApi";

import {Typography} from "@mui/material";
import LandingProductCard from "@/src/modules/product/LandingProductCard";


export default function OurProducts() {
    const [products, setProducts] = useState([]);
    const {t} = useTranslation();

    useEffect(() => {
        async function fetchProducts() {
            const responseData = await productApi.getAll();
            setProducts(responseData.data);
        }

        fetchProducts();
    }, [])

    return (
        <section className='flex justify-center w-full bg-white relative z-10'> {/* overflow-hidden clips the carousel sides */}

            {/* Wrapper/Limiter */}
            <div className="relative w-full max-w-375 flex flex-col items-center pt-8">

                {/* Title */}
                <div className="mx-auto">
                    <Typography variant="h2" sx={{fontWeight: 400}}>
                        {t("our_products.title")}
                    </Typography>
                </div>


                {/* Paragraphs */}
                <div className="md:px-8 px-4 flex flex-col gap-3 text-justify md:my-8 my-4 mb-6">
                    <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.8 }}>
                        <Trans i18nKey="our_products.paragraph1" components={{ b: <strong style={{ color: '#08120C' }} /> }} />
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.8 }}>
                        <Trans i18nKey="our_products.paragraph2" components={{ b: <strong style={{ color: '#08120C' }} /> }} />
                    </Typography>
                </div>
                {/* Carousel — anchored to max-w limiter but bleeds right */}
                <div className="grid md:grid-cols-2 grid-cols-2 gap-4 w-full max-w-170 mx-auto px-2 ">
                    {products.map((product, index) => <LandingProductCard key={index} product={product}/>)}


                </div>

            </div>

        </section>
    )
}
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    i18n: {
        locales: ["en", "fr"],
        defaultLocale: "en",
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9000',
                pathname: '/**',
            },
            // When you deploy, add your production domain too:
            // {
            //   protocol: 'https',
            //   hostname: 'your-production-domain.com',
            //   pathname: '/**',
            // },
        ],
    },
};

export default nextConfig;
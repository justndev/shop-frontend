import { Typography, Box } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";

export default function AdvantagesText() {
    const { t } = useTranslation();

    const bullets = [
        "adva.bullet1",
        "adva.bullet2",
        "adva.bullet3",
        "adva.bullet4",
        "adva.bullet5",
    ];

    return (
        <div className="relative w-full bg-white py-10" style={{ zIndex: 2 }}>
            {/* Centred intro paragraph */}
            <div className="max-w-375 mx-auto px-6 pb-10 text-center">
                <Typography variant="body1" sx={{ color: "#444", lineHeight: 1.8 }}>
                    <Trans
                        i18nKey="adva.paragraph1"
                        components={{ b: <strong style={{ color: "#08120C" }} /> }}
                    />
                </Typography>
            </div>

            {/* Bullet list — centred block, text left-aligned */}
            <Box
                sx={{
                    maxWidth: "32rem",          // keeps the block narrow like the screenshot
                    mx: "auto",
                    px: 3,
                    pb: 6,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",   // left-align text inside the centred block
                    gap: 1,
                }}
            >
                {bullets.map((key) => (
                    <Box
                        key={key}
                        sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                    >
                        {/* Bullet dot */}
                        <Typography
                            component="span"
                            sx={{ color: "#444", lineHeight: 1.8, flexShrink: 0 }}
                        >
                            •
                        </Typography>

                        <Typography variant="body1" sx={{ color: "#444", lineHeight: 1.8 }}>
                            <Trans
                                i18nKey={key}
                                components={{
                                    b: <strong style={{ color: "#08120C" }} />,
                                }}
                            />
                        </Typography>
                    </Box>
                ))}
            </Box>
        </div>
    );
}
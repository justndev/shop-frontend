import {Typography} from "@mui/material";
import {Trans} from "react-i18next";

export default function ExpertiseParagraph() {
    return (
        <div className="relative w-full bg-white py-10" style={{ zIndex: 2 }}>
            {/* Centred paragraph with bold highlights */}
            <div className="max-w-2xl mx-auto px-6 pb-16 text-center">
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
        </div>
    )
}
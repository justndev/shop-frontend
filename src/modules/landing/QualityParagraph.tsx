import {Trans} from "react-i18next";
import {Typography} from "@mui/material";

export default function QualityParagraph() {
    return (
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
            <Typography variant="body1" sx={{color: '#444', lineHeight: 1.8}}>
                <Trans
                    i18nKey="quality.paragraph"
                    components={{b: <strong style={{color: '#08120C'}}/>}}
                />
            </Typography>
        </div>
    )
}
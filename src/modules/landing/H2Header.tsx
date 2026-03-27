import {Typography} from "@mui/material";
import {Trans} from "react-i18next";

export default function H2Header() {
    return (
        <Typography variant="h2" className="text-[#193028] mb-5 leading-snug" sx={{fontWeight: 400}}>
            <Trans i18nKey="why_us.title" components={{ b: <strong /> }} />
        </Typography>
    )
}
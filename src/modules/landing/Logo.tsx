import Link from "next/link";
import {Typography} from "@mui/material";

export default function Logo() {
    return (
        <Link href="/">
            <Typography
                sx={{fontWeight: 'bold', color: '#FFFFFF'}}
            >
                PU'ER EXPERT
            </Typography>
        </Link>
    )
}

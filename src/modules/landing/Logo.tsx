import Link from "next/link";
import {Typography} from "@mui/material";

export default function Logo() {
    return (
        <Link href="/">
            <Typography
                sx={{fontWeight: 'bold', color: '#FFFFFF'}}
            >
                PUERH EXPERT
            </Typography>
            {/*<span className="htext-2xl font-black tracking-widest text-[#3d2e1a">TEAROMA</span>*/}
        </Link>
    )
}
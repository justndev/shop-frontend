// src/components/UnderlineButton.tsx
import { ButtonProps, Typography } from "@mui/material";
import Link from "next/link";

export default function UnderlineButton({ children, href }: ButtonProps) {
    return (
        <Link href={href!}>
            <Typography sx={{
                p: 0,
                minWidth: 0,
                textTransform: 'none',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                color: 'primary.main',
                transition: 'opacity 0.2s, letter-spacing 0.2s',
                fontWeight: 500,
                '&:hover': {
                    cursor: 'pointer',
                }}}
            >
                {children}
            </Typography>
        </Link>
    );
}

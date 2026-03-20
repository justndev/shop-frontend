'use client';

import { Box, Typography } from "@mui/material";

interface DividerWithTextProps {
    text: string;
}

export default function DividerWithText({ text }: DividerWithTextProps) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                my: 1,
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: "divider",
                }}
            />
            <Typography
                variant="body2"
                sx={{ px: 2, color: "text.secondary", whiteSpace: "nowrap" }}
            >
                {text}
            </Typography>
            <Box
                sx={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: "divider",
                }}
            />
        </Box>
    );
}

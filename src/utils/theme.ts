import { createTheme } from '@mui/material/styles';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });


export const theme = createTheme({
    typography: {
        fontFamily: montserrat.style.fontFamily,
        button: {
            letterSpacing: '0.1em',
            fontWeight: 600,
        },
        body1: {
            letterSpacing: '0.05em',
        },
        body2: {
            letterSpacing: '0.05em',
        },
        caption: {
            letterSpacing: '0.03em',
        },
    },
    palette: {
        primary: {
            main: '#1d4030',
        },
        secondary: {
            main: '#cfdad6',
        },
        white: {
            main: '#ffffff',
        },
    },
    components: {
        MuiTypography: {
            styleOverrides: {
                h4: {
                    letterSpacing: '0.05em',
                    color: "#193028",
                },
                h2: ({ theme }) => ({
                    letterSpacing: '0.05em',
                    color: "#193028",
                    fontSize: '40px',
                    [theme.breakpoints.down('md')]: {
                        fontSize: '30px',
                    },
                }),
                body2: () => ({
                    letterSpacing: '0.05em',
                    color: "#193028",
                    fontSize: '16px',
                }),
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '999px',
                    textTransform: 'none',
                },
                text: {
                    textDecoration: 'underline',
                    '&:hover': {
                        textDecoration: 'underline',
                        background: 'transparent',
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
        },
    },
});

import { createMuiTheme } from '@material-ui/core/styles';
export const theme = createMuiTheme({
    palette: {
        common: {
            black: "#000000",
            white: "#FFFFFF"
        },
        primary: {
            light: "#AEBAFE",
            main: "#5567d5",
            dark: "#5346B6",
            contrastText: "#222228"
        },
        secondary: {
            light: "#f7f8fb",
            main: "#ccd1f2"
        },
        error: {
            light: "#FAE8E8",
            main: "#FD6B6B"
        },
        success: {
            light: "#E1F4ED",
            main: "#36B475"
        },
        grey: {
            100: "#eff1f5",
            200: "#e6e7ec",
            300: "#8d91a3",
            400: "#8d91a3",
            500: "#222228",
            600: "#181c20",
            700: "#1d2028"
        }
    },
    typography: {
        fontFamily: "Gilmer",
        h1: {
            fontSize: 29,
            fontWeight: "bold",
            fontStretch: "normal",
            fontStyle: "normal",
            lineHeight: 1.38,
            letterSpacing: "normal"
        },
        h3: {
            fontSize: 17,
            fontWeight: "bold",
            fontStretch: "normal",
            fontStyle: "normal",
            lineHeight: 1.41,
            letterSpacing: "normal"
        },
        h4: {
            fontSize: 14,
            fontWeight: 500,
            fontStretch: "normal",
            fontStyle: "normal",
            lineHeight: "normal",
            letterSpacing: "normal"
        },
        h5: {
            fontSize: 13,
            fontWeight: 500,
            fontStretch: "normal",
            fontStyle: "normal",
            lineHeight: 1.08,
            letterSpacing: "normal"
        },
        subtitle1: {
            fontSize: 15,
            fontWeight: "normal",
            fontStretch: "normal",
            fontStyle: "normal",
            lineHeight: 1.6,
            letterSpacing: "normal"
        },
        subtitle2: {
            fontSize: 14,
            fontWeight: "normal",
            fontStretch: "normal",
            fontStyle: "normal",
            lineHeight: 1.71,
            letterSpacing: "normal"
        },
        body1: {
            fontSize: 13,
            fontWeight: "normal",
            fontStretch: "normal",
            fontStyle: "normal",
            lineHeight: 1.85,
            letterSpacing: "normal"
        },
        body2: {
            fontSize: 12,
            fontWeight: "normal",
            fontStretch: "normal",
            fontStyle: "normal",
            lineHeight: 2,
            letterSpacing: "normal"
        }
    },
    props: {
        MuiButton: {
            disableRipple: true,
            disableFocusRipple: true,
        },
        MuiDialog: {
            transitionDuration: {
                enter: 550,
                exit: 450
            },
        }
    },
    overrides: {
        MuiTooltip: {
            tooltip: {
                height: "auto",
                borderRadius: 4,
                backgroundColor: "#40404B",
                boxShadow: "0 1px 10px 0 rgba(0,0,0,0.22)",
                fontSize: 12,
                color: "#FFFFFF",
                fontWeight: 400
            },
        },
        MuiBackdrop: {
            root: {
                backgroundColor: "rgba(230,231,235,0.9)"
            }
        }
    }
});

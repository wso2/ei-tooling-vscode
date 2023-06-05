import { createStyles, makeStyles } from "@mui/styles";

export const LabelStyles = makeStyles(() => createStyles({
    container: {
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        boxShadow: "0px 5px 50px rgba(203, 206, 219, 0.5)",
    },
    containerHidden: {
        visibility: "hidden",
    },
    element: {
        backgroundColor: 'whitesmoke',
        padding: "10px",
        cursor: "pointer",
        transitionDuration: "0.2s",
        userSelect: "none",
        pointerEvents: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
            filter: "brightness(0.95)",
        },
    },
    iconWrapper: {
        height: "8px",
        width: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    IconButton: {
        color: 'grey',
        fontSize:'13px !important',
    },
    separator: {
        height: "15px",
        width: "1px",
        backgroundColor: 'grey',
    },
    rightBorder: {
        borderRightWidth: "2px",
        borderColor: 'black',
    },
    loadingContainer: {
        padding: "10px"
    },
    circularProgress: {
        color: "#CBCEDB",
        display: "block"
    }
})
);
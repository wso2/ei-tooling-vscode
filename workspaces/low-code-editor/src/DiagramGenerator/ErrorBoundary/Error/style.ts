import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            margin: '25vh 0'
        },
        errorContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        },
        errorTitle: {
            color: theme.palette.grey[500]
        },
        errorMsg: {
            paddingTop: theme.spacing(2),
            color: theme.palette.grey[400]
        },
        errorImg: {
            paddingTop: theme.spacing(10),
            paddingBottom: theme.spacing(5),
            display: "block"
        },
        gridContainer: {
            height: "100%"
        },
        link: {
            color: theme.palette.primary.main,
            textDecoration: "underline",
            "&:hover, &:focus, &:active": {
                color: theme.palette.primary.main,
                textDecoration: "underline",
            }
        }
    })
);

import * as React from "react";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ErrorGenSvg from "./ErrorSvg";
import { useStyles } from "./style";

export default function Default() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid
                container={true}
                direction="column"
                justify="center"
                alignItems="center"
                className={classes.gridContainer}
            >
                <Grid item={true}>
                    <ErrorGenSvg />
                </Grid>
                <Grid item={true}>
                    <Typography variant="h4" className={classes.errorTitle} component="div">
                        A problem occurred while generating the diagram.
                    </Typography>
                </Grid>
                <Grid item={true}>
                    <Typography variant="subtitle2" component="div" className={classes.errorMsg}>
                        Please raise an issue with the sample code in our <a href="https://github.com/wso2/ballerina-plugin-vscode/issues">issue tracker</a>
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
}

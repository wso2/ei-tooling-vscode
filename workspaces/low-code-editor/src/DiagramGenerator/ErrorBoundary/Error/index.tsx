/**
 * Copyright (c) 2023, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

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

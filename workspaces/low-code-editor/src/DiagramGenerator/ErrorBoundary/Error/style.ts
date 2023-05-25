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

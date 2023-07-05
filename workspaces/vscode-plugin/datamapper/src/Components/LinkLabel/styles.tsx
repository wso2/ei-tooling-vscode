
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
        fontSize:'11px !important',
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

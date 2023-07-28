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

export const portStyles = makeStyles(() => createStyles({
    portContainer: {
        padding: '8px',
        border: '1px solid grey',
    },
    port: {
        width: '175px',
        height: '25 px',
        background: '#D3D3D3',
        fontSize: '11px',
        border: '1px solid #83a9cc',
        padding: '4px',
        marginTop: '5px'
    },
    joinPort: {
        background: '#d8d8d8',
        fontSize: '10px',
        border: '1px solid #E5E4E2',
        padding: '4px'
    },
    portLabel: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    portIcon: {
        display: "flex",
        justifyContent: "stretch",
        alignItems: "center",
    },
    LabelRight: {
        paddingRight: '2px'
    },
    LabelLeft: {
        paddingLeft: '2px'
    }
})
);

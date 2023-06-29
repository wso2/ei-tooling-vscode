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

export const nodeStyles = makeStyles(() => createStyles({
    node: {
        height: '30px',
        width: '200px',
        alignItems: 'center',
        cursor: 'pointer',
        position: 'relative',
        borderRadius: '2px',
        backgroundColor: 'grey',
    },
    joinNode: {
        height: '30px',
        width: '205px',
        alignItems: 'center',
        cursor: 'pointer',
        position: 'relative',
        borderRadius: '2px',
        backgroundColor: '#ADD8E6',
    },
    nodeLabel: {
        fontSize: '15px',
        fontFamily: 'Asap',
        color: 'white',
        paddingTop: '4px'
    },
    portContainer: {
        padding: '8px',
        border: '1px solid grey',
    },
    root: {
        width: '100%',
        backgroundColor: '#d8d8d8',
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        boxShadow: "0px 5px 50px rgba(203, 206, 219, 0.5)",
        borderRadius: "5px",
        alignItems: "center",
        overflow: "hidden",
    },
    element: {
        backgroundColor: 'grey',
        padding: "5px",
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
    fromClause: {
        padding: "5px",
        fontFamily: "monospace"
    },
    mappingPane: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    icons: {
        padding: '8px',
        '&:hover': {
            backgroundColor: '#F0F1FB',
        }
    },
    expandIcon: {
        height: '15px',
        width: '15px',
        marginTop: '-7px'
    },
    buttonWrapper: {
        border: '1px solid #e6e7ec',
        borderRadius: '8px',
        position: "absolute",
        right: "35px"
    },
    separator: {
        height: "22px",
        width: "1px",
        backgroundColor: "grey",
    },
    Icon: {
        color: 'white',
        paddingLeft: "15px",
        height: "32px",
        width: "32px"
    },
})
);


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

export const uploadStyles = makeStyles(() => createStyles({
    header: {
        alignItems: 'flex-end',
        backgroundColor: 'white',
        margin: '0px !important',
        justifyContent: 'flex-end !important'
    },
    dialogHeader: {
        height: '40px',
        color: 'white',
        width:'98%',
        backgroundColor: '#187bcd',
        fontFamily: 'Asap !important',
        fontWeight: '700',
        fontSize: '16px !important',
        padding: '0px 10px 10px 20px !important',
        marginBottom: '10px !important'
    },
    closeButton: {
        paddingLeft: '62% !important'
    },
    saveButton: {
        marginLeft: '70% !important',
        fontSize: '10px !important',
        width: '60px !important',
        height: '30px !important'
    },
    Label: {
        fontSize: '11px !important'
    },
    Select: {
        margin: '8px 0px 10px 0px !important',
        alignItems: 'center',
        height: '35px !important',
        fontSize: '11px !important',
        minWidth: '130px !important'
    },
    FileInput: {
        marginTop: '8px !important',
    },
    TextField: {
        paddingBottom: '10px !important',
        paddingRight: '10px !important',
    }
})
);

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

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useGeneratorStyles = makeStyles((theme: Theme) =>
    createStyles({
        loader: {
            border: "16px solid #f3f3f3",
            borderTop: "16px solid #dadada",
            borderRadius: "50%",
            width: "150px",
            height: "150px",
            animation: "spin 2s linear infinite",
            margin: "auto",
        },
        lowCodeContainer: {
            backgroundColor: "transparent",
            height: "100%",
        },
        loaderContainer: {
            marginRight: theme.spacing(1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            height: "100vh",
        },
        errorMessageDialog: {
            paddingLeft: "30px",
        }
    })
);

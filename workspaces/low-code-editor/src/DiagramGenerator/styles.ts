/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein is strictly forbidden, unless permitted by WSO2 in accordance with
 * the WSO2 Commercial License available at http://wso2.com/licenses.
 * For specific language governing the permissions and limitations under
 * this license, please see the license as well as any agreement you’ve
 * entered into with WSO2 governing the purchase of this software and any
 * associated services.
 */
// tslint:disable: ordered-imports
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

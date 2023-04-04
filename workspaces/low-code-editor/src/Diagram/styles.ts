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

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        progressContainer: {
            position: "absolute",
            paddingTop: theme.spacing(9),
            textAlign: "center"
        },
        DesignContainer: {
            minWidth: "100%",
            scrollbarWidth: "none",
            margin: 0,
            padding: 0,
            '&::-webkit-scrollbar': {
                width: '0em'
            }
        },
        OverlayContainer: {
            position: "relative",
            height: "0",
            width: "0"
        },
        perLoaderText: {
            margin: "-4rem 0 0 4rem !important",
            color: '#8D91A3',
            fontSize: 13,
            letterSpacing: 0.3,
            fontFamily: 'inherit',
        },
        tourWrapper: {
            height: 232,
            width: 350,
            borderRadius: 8,
            backgroundColor: '#5567D5',
            boxShadow: '0 10px 70px 0 rgba(123, 123, 123, 0.15)',
            position: 'fixed',
            bottom: 80,
            right: 77,
            padding: '2.5rem 1.5rem',
            color: '#fff',
            fontFamily: 'inherit',
            letterSpacing: 0,
            zIndex: 1000,
            '& h2': {
                fontSize: 15,
            },
            '& p': {
                fontSize: 13,
            }
        },
        tourTitle: {
            fontFamily: 'inherit',
            letterSpacing: 0,
            fontWeight: 600
        },
        tourPara: {
            letterSpacing: 0,
            fontWeight: 100,
            lineHeight: 2,
        },
        primertBtn: {
            height: 40,
            width: 138,
            borderRadius: 5,
            backgroundColor: '#fff',
            boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
            border: "none",
            fontFamily: 'inherit',
            fontSize: 13,
            color: '#5567D5',
            cursor: 'pointer',
            '&:hover': {
                opacity: 0.5,
                cursor: 'pointer',
            },
        },
        linkBtn: {
            height: 13,
            width: 119,
            opacity: 0.5,
            color: '#FFF',
            fontSize: 13,
            letterSpacing: 0,
            textAlign: 'center',
            background: 'none',
            border: "none",
            fontFamily: 'inherit',
        },
        diagramStateWrapper: {
            // right: '2rem',
            marginRight: 'auto',
            position: "absolute",
            // top: '4.1rem'
            right: '4.2rem',
            top: '1rem'
        },
        diagramAPIStateWrapper: {
            right: '4.2rem',
            marginRight: 'auto',
            position: "absolute",
            top: '4.3rem'
        },
        diagramErrorStateWrapper: {
            width: 465,
            bottom: "3.5rem",
            left: "5.5rem",
            position: "absolute",
            marginRight: 'auto',
            zIndex: 2,
        },
        diagramErrorStateWrapperWithConfig: {
            left: "8rem",
        },
        updateButton: {
            display: 'flex',
            justifyContent: "flex-end",
            cursor: "pointer"
        },
        diagamInactive: {
            height: 32,
            width: 148,
            borderRadius: 16,
            backgroundColor: '#E6E7EC',
            display: 'flex',
        },
        inactiveText: {
            color: '#40404B',
            fontFamily: "inherit",
            fontSize: 11,
            letterSpacing: 0,
            lineHeight: '29px',
        },
        disableDiagramIcon: {
            left: '1rem',
            position: "fixed",
            top: '1.1rem',
            zIndex: 3
        },
        disableAPIDiagramIcon: {
            left: '1rem',
            position: "fixed",
            top: '4.1rem',
            zIndex: 3
        },
        disableDiagramIconWithTextLoader: {
            left: '10rem',
            position: "fixed",
            top: '4.1rem',
            zIndex: 3
        }
    }),
);

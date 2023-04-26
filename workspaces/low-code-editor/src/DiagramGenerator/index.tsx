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

import { useGeneratorStyles } from "./styles";
import { EditorProps } from "./vscode";
import React from "react";
import { getLowcodeST, getSyntaxTree } from "./generatorUtil";
import { STNode } from "@wso2-ei/syntax-tree";
import { MuiThemeProvider } from "@material-ui/core";
import { DiagramGenErrorBoundary } from "./ErrorBoundary";
import { CirclePreloader } from "../PreLoader/CirclePreLoader";
import LowCodeEditor from "../index";
import { IntlProvider } from "react-intl";
import { theme } from "./theme";
import messages from '../lang/en.json';
import ErrorScreen from './ErrorBoundary/Error';

export interface DiagramGeneratorProps extends EditorProps {

}

export function LowCodeDiagramGenerator(props: DiagramGeneratorProps) {
    const {
        langClientPromise,
        filePath,
        fileUri,
        lastUpdatedAt
    } = props;
    const classes = useGeneratorStyles();

    const [syntaxTree, setSyntaxTree] = React.useState<STNode>();
    const [fileContent, setFileContent] = React.useState("");
    const [isDiagramError, setIsDiagramError] = React.useState(false);

    React.useEffect(() => {
        // TODO: move this to view manager
        (async () => {
            let showDiagramError = false;
            try {
                const langClient = await langClientPromise;
                let genSyntaxTree: any = await getSyntaxTree(filePath, langClient);
                const content = await props.getFileContent(filePath);
                const visitedSyntaxTree: STNode = await getLowcodeST(genSyntaxTree);
                if (!visitedSyntaxTree) {
                    return (<div><h1>Parse error...!</h1></div>);
                }

                setSyntaxTree(visitedSyntaxTree);
                setFileContent(content);
            } catch (err) {
                // tslint:disable-next-line: no-console
                console.error(err)
                showDiagramError = true;
            }

            setIsDiagramError(showDiagramError);
        })();
    }, [lastUpdatedAt]);

    React.useEffect(() => {
        (async () => {
            let showDiagramError = false;
            try {
                const langClient = await langClientPromise;
                let genSyntaxTree: any = await getSyntaxTree(filePath, langClient);
                const content = await props.getFileContent(filePath);

                const visitedSyntaxTree: STNode = await getLowcodeST(genSyntaxTree);
                if (!visitedSyntaxTree) {
                    return (<div><h1>Parse error...!</h1></div>);
                }

                setSyntaxTree(visitedSyntaxTree);

                setFileContent(content);
            } catch (err) {
                // tslint:disable-next-line: no-console
                console.error(err)
                showDiagramError = true;
            }

            setIsDiagramError(showDiagramError);
        })();
    }, [filePath])

    if (!syntaxTree && !isDiagramError) {
        return (<div className={classes.loaderContainer}><CirclePreloader position="relative" /></div>);
    }

    // FIXME: Doing this to make main branch build pass so others can continue merging changes
    // on top of typed context
    const missingProps: any = {};

    const diagramComponent = (
        <DiagramGenErrorBoundary lastUpdatedAt={lastUpdatedAt} >
            <LowCodeEditor
                {...missingProps}
                isReadOnly={false}
                syntaxTree={syntaxTree}
                currentFile={{
                    content: fileContent,
                    path: filePath,
                    uri: fileUri,
                    size: 1,
                    type: "File"
                }}
                api={{
                    ls: {
                        getDiagramEditorLangClient: () => {
                            return langClientPromise;
                        },
                        getExpressionEditorLangClient: () => {
                            return langClientPromise;
                        }
                    },
                    code: {
                        gotoSource: (position: { startLine: number, startColumn: number }) => {
                            props.gotoSource(filePath, position);
                        },
                        updateFileContent: (content: string, skipForceSave?: boolean) => {
                            return props.updateFileContent(filePath, content, skipForceSave);
                        }
                    }
                }}
            />
        </DiagramGenErrorBoundary>
    )

    return (
        <MuiThemeProvider theme={theme}>
            <div className={classes.lowCodeContainer}>
                <IntlProvider locale='en' defaultLocale='en' messages={messages}>
                    {isDiagramError && <ErrorScreen />}
                    {!isDiagramError && diagramComponent}
                </IntlProvider>
            </div>
        </MuiThemeProvider>
    );
}

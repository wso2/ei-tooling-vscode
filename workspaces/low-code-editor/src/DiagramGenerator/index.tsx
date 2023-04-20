import { useGeneratorStyles } from "./styles";
import {EditorProps} from "./vscode/Diagram";
import React from "react";
import {getLowcodeST, getSyntaxTree} from "./generatorUtil";
import {STNode} from "@wso2-ei/syntax-tree";
import {MuiThemeProvider} from "@material-ui/core";
import { DiagramGenErrorBoundary } from "./ErrorBoundary";
import { CirclePreloader } from "../PreLoader/CirclePreLoader";
import LowCodeEditor from "../index";
import {IntlProvider} from "react-intl";
import {theme} from "./theme";
import messages from '../lang/en.json';
import ErrorScreen from './ErrorBoundary/Error';

// export function OverviewDiagramGenerator(props: EditorProps) {
//     return (
//         <DiagramViewManager {...props} />
//     )
// }

export interface DiagramGeneratorProps extends EditorProps {

}

export function LowCodeDiagramGenerator(props: DiagramGeneratorProps) {
    const {
        langClientPromise,
        filePath,
        lastUpdatedAt
    } = props;
    const classes = useGeneratorStyles();
    // const defaultScale = scale ? Number(scale) : 1;
    // const defaultPanX = panX ? Number(panX) : 0;
    // const defaultPanY = panY ? Number(panY) : 0;
    // const runCommand: (command: PALETTE_COMMANDS, args: any[]) => Promise<boolean> = props.runCommand;
    // const runBackgroundTerminalCommand: (command: string) => Promise<CommandResponse> = props.runBackgroundTerminalCommand;
    // const openArchitectureView: (nodeId: string) => Promise<boolean> = props.openArchitectureView;
    // const showMessage: (message: string, type: MESSAGE_TYPE, isIgnorable: boolean, filePath?: string, fileContent?: string, bypassChecks?: boolean) => Promise<boolean> = props.showMessage;
    // const getLibrariesList: (kind?: LibraryKind) => Promise<LibraryDocResponse | undefined> = props.getLibrariesList;
    // const getLibrariesData: () => Promise<LibrarySearchResponse | undefined> = props.getLibrariesData;
    // const getLibraryData: (orgName: string, moduleName: string, version: string) => Promise<LibraryDataResponse | undefined> = props.getLibraryData;
    // const getSentryConfig: () => Promise<SentryConfig | undefined> = props.getSentryConfig;
    // const getBalVersion: () => Promise<string | undefined> = props.getBallerinaVersion;
    // const getEnv: (name: string) => Promise<any> = props.getEnv;
    // const openExternalUrl: (url: string) => Promise<boolean> = props.openExternalUrl;

    // const defaultZoomStatus = {
    //     scale: defaultScale,
    //     panX: defaultPanX,
    //     panY: defaultPanY,
    // };

    const [fullSyntaxTree, setFullSyntaxTree] = React.useState(undefined);
    const [syntaxTree, setSyntaxTree] = React.useState<STNode>();
    // const [zoomStatus, setZoomStatus] = React.useState(defaultZoomStatus);
    const [fileContent, setFileContent] = React.useState("");
    // const [isMutationInProgress, setMutationInProgress] = React.useState<boolean>(false);
    // const [isModulePullInProgress, setModulePullInProgress] = React.useState<boolean>(false);
    // const [loaderText, setLoaderText] = React.useState<string>('Loading...');
    // const [lowCodeResourcesVersion, setLowCodeResourcesVersion] = React.useState(undefined);
    // const [lowCodeEnvInstance, setLowCodeEnvInstance] = React.useState("");
    // const [balVersion, setBalVersion] = React.useState("");
    // const [isCodeServer, setCodeServer] = React.useState<boolean>(false);
    // const initSelectedPosition = startColumn === 0 && startLine === 0 && syntaxTree ? // TODO: change to use undefined for unselection
    //     getDefaultSelectedPosition(syntaxTree)
    //     : { startLine, startColumn }

    // const [selectedPosition, setSelectedPosition] = React.useState(initSelectedPosition);
    const [isDiagramError, setIsDiagramError] = React.useState(false);

    console.log("inside diagram generator index")


    React.useEffect(() => {
        // TODO: move this to view manager
        (async () => {
            let showDiagramError = false;
            try {
                const langClient = await langClientPromise;
                // const genSyntaxTree: any = await getSyntaxTree(filePath, langClient);
                let genSyntaxTree: any = "{\n    \"startTagOpenOffset\": 39,\n    \"startTagOffOffset\": 125,\n    \"endTagOpenOffset\": 394,\n    \"endTagOffOffset\": 399,\n    \"start\": 39,\n    \"end\": 400,\n    \"kind\": \"api\",\n    \"selfClosed\": false,\n    \"hasTextNode\": false,\n    \"children\": [\n      {\n        \"startTagOpenOffset\": 131,\n        \"startTagOffOffset\": 175,\n        \"endTagOpenOffset\": 382,\n        \"endTagOffOffset\": 392,\n        \"start\": 131,\n        \"end\": 393,\n        \"kind\": \"resource\",\n        \"selfClosed\": false,\n        \"hasTextNode\": false,\n        \"children\": [\n          {\n            \"startTagOpenOffset\": 185,\n            \"startTagOffOffset\": 196,\n            \"endTagOpenOffset\": 274,\n            \"endTagOffOffset\": 286,\n            \"start\": 185,\n            \"end\": 287,\n            \"kind\": \"inSequence\",\n            \"selfClosed\": false,\n            \"hasTextNode\": false,\n            \"children\": [\n              {\n                \"startTagOpenOffset\": 210,\n                \"startTagOffOffset\": -1,\n                \"endTagOpenOffset\": -1,\n                \"endTagOffOffset\": -1,\n                \"start\": 210,\n                \"end\": 216,\n                \"kind\": \"log\",\n                \"selfClosed\": true,\n                \"hasTextNode\": false,\n                \"children\": [],\n                \"attributes\": []\n              },\n              {\n                \"startTagOpenOffset\": 255,\n                \"startTagOffOffset\": -1,\n                \"endTagOpenOffset\": -1,\n                \"endTagOffOffset\": -1,\n                \"start\": 255,\n                \"end\": 265,\n                \"kind\": \"respond\",\n                \"selfClosed\": true,\n                \"hasTextNode\": false,\n                \"children\": [],\n                \"attributes\": []\n              }\n            ],\n            \"attributes\": []\n          },\n          {\n            \"startTagOpenOffset\": 296,\n            \"startTagOffOffset\": 308,\n            \"endTagOpenOffset\": 338,\n            \"endTagOffOffset\": 351,\n            \"start\": 296,\n            \"end\": 352,\n            \"kind\": \"outSequence\",\n            \"selfClosed\": false,\n            \"hasTextNode\": false,\n            \"children\": [\n              {\n                \"startTagOpenOffset\": 322,\n                \"startTagOffOffset\": -1,\n                \"endTagOpenOffset\": -1,\n                \"endTagOffOffset\": -1,\n                \"start\": 322,\n                \"end\": 329,\n                \"kind\": \"send\",\n                \"selfClosed\": true,\n                \"hasTextNode\": false,\n                \"children\": [],\n                \"attributes\": []\n              }\n            ],\n            \"attributes\": []\n          }\n        ]\n      }\n    ]\n  }";
                // genSyntaxTree = JSON.stringify(genSyntaxTree)
                const sanitizedJson = sanitizeBadJson(genSyntaxTree);
                genSyntaxTree = JSON.parse(await sanitizedJson);
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

    // React.useEffect(() => {
    //     (async () => {
    //         const version: string = await getBalVersion();
    //         setBalVersion(version);
    //         const isCodeServerInstance: string = await getEnv("CODE_SERVER_ENV");
    //         setCodeServer(isCodeServerInstance === "true");
    //         const sentryConfig: SentryConfig = await getSentryConfig();
    //         if (sentryConfig) {
    //             init(sentryConfig);
    //         }
    //     })();
    // }, []);

    React.useEffect(() => {
        (async () => {
            let showDiagramError = false;
            try {
                const langClient = await langClientPromise;
                // const genSyntaxTree: STNode = await getSyntaxTree(filePath, langClient);
                let genSyntaxTree: any = "{\n    \"startTagOpenOffset\": 39,\n    \"startTagOffOffset\": 125,\n    \"endTagOpenOffset\": 394,\n    \"endTagOffOffset\": 399,\n    \"start\": 39,\n    \"end\": 400,\n    \"kind\": \"api\",\n    \"selfClosed\": false,\n    \"hasTextNode\": false,\n    \"children\": [\n      {\n        \"startTagOpenOffset\": 131,\n        \"startTagOffOffset\": 175,\n        \"endTagOpenOffset\": 382,\n        \"endTagOffOffset\": 392,\n        \"start\": 131,\n        \"end\": 393,\n        \"kind\": \"resource\",\n        \"selfClosed\": false,\n        \"hasTextNode\": false,\n        \"children\": [\n          {\n            \"startTagOpenOffset\": 185,\n            \"startTagOffOffset\": 196,\n            \"endTagOpenOffset\": 274,\n            \"endTagOffOffset\": 286,\n            \"start\": 185,\n            \"end\": 287,\n            \"kind\": \"inSequence\",\n            \"selfClosed\": false,\n            \"hasTextNode\": false,\n            \"children\": [\n              {\n                \"startTagOpenOffset\": 210,\n                \"startTagOffOffset\": -1,\n                \"endTagOpenOffset\": -1,\n                \"endTagOffOffset\": -1,\n                \"start\": 210,\n                \"end\": 216,\n                \"kind\": \"log\",\n                \"selfClosed\": true,\n                \"hasTextNode\": false,\n                \"children\": [],\n                \"attributes\": []\n              },\n              {\n                \"startTagOpenOffset\": 255,\n                \"startTagOffOffset\": -1,\n                \"endTagOpenOffset\": -1,\n                \"endTagOffOffset\": -1,\n                \"start\": 255,\n                \"end\": 265,\n                \"kind\": \"respond\",\n                \"selfClosed\": true,\n                \"hasTextNode\": false,\n                \"children\": [],\n                \"attributes\": []\n              }\n            ],\n            \"attributes\": []\n          },\n          {\n            \"startTagOpenOffset\": 296,\n            \"startTagOffOffset\": 308,\n            \"endTagOpenOffset\": 338,\n            \"endTagOffOffset\": 351,\n            \"start\": 296,\n            \"end\": 352,\n            \"kind\": \"outSequence\",\n            \"selfClosed\": false,\n            \"hasTextNode\": false,\n            \"children\": [\n              {\n                \"startTagOpenOffset\": 322,\n                \"startTagOffOffset\": -1,\n                \"endTagOpenOffset\": -1,\n                \"endTagOffOffset\": -1,\n                \"start\": 322,\n                \"end\": 329,\n                \"kind\": \"send\",\n                \"selfClosed\": true,\n                \"hasTextNode\": false,\n                \"children\": [],\n                \"attributes\": []\n              }\n            ],\n            \"attributes\": []\n          }\n        ]\n      }\n    ]\n  }";
                // genSyntaxTree = JSON.stringify(genSyntaxTree)
                const sanitizedJson = sanitizeBadJson(genSyntaxTree);
                genSyntaxTree = JSON.parse(await sanitizedJson);
                const content = await props.getFileContent(filePath);

                // if (genSyntaxTree?.typeData?.diagnostics && genSyntaxTree?.typeData?.diagnostics?.length > 0) {
                //     resolveMissingDependency(filePath, content);
                // }
                const vistedSyntaxTree: STNode = await getLowcodeST(genSyntaxTree);
                if (!vistedSyntaxTree) {
                    return (<div><h1>Parse error...!</h1></div>);
                }

                setSyntaxTree(vistedSyntaxTree);

                // setFullSyntaxTree(vistedSyntaxTree);

                // undoRedo.updateContent(filePath, content);
                setFileContent(content);
                // setLowCodeResourcesVersion(await getEnv("BALLERINA_LOW_CODE_RESOURCES_VERSION"));
                // setLowCodeEnvInstance(await getEnv("VSCODE_CHOREO_SENTRY_ENV"));
                // Add performance data
                // await addPerfData(vistedSyntaxTree);

                // setSelectedPosition(startColumn === 0 && startLine === 0 ?
                //     getDefaultSelectedPosition(vistedSyntaxTree as STNode)
                //     : { startLine, startColumn });
            } catch (err) {
                // tslint:disable-next-line: no-console
                console.error(err)
                showDiagramError = true;
            }

            setIsDiagramError(showDiagramError);
        })();
    }, [filePath])

    // async function showTryitView(serviceName: string, range: LineRange) {
    //     runCommand(PALETTE_COMMANDS.TRY_IT, [filePath, serviceName, range]);
    // }
    //
    // async function showDocumentationView(url: string) {
    //     runCommand(PALETTE_COMMANDS.DOCUMENTATION_VIEW, [url]);
    // }
    //
    // async function run(args: any[]) {
    //     runCommand(PALETTE_COMMANDS.RUN, args);
    // }

    async function sanitizeBadJson(inputJson: string): Promise<string> {
        return inputJson
            // Replace ":" with "@colon@" if it's between double-quotes
            .replace(/:\s*"([^"]*)"/g, function (match, p1) {
                return ': "' + p1.replace(/:/g, '@colon@') + '"';
            })
            // Replace ":" with "@colon@" if it's between single-quotes
            .replace(/:\s*'([^']*)'/g, function (match, p1) {
                return ': "' + p1.replace(/:/g, '@colon@') + '"';
            })
            // Add double-quotes around any tokens before the remaining ":"
            .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')
            // Turn "@colon@" back into ":"
            .replace(/@colon@/g, ':')
    }

    // const undo = async () => {
    //     const path = undoRedo.getFilePath();
    //     const uri = monaco.Uri.file(path).toString();
    //     const lastsource = undoRedo.undo();
    //     const langClient = await langClientPromise;
    //     if (lastsource) {
    //         langClient.didChange({
    //             contentChanges: [
    //                 {
    //                     text: lastsource
    //                 }
    //             ],
    //             textDocument: {
    //                 uri,
    //                 version: 1
    //             }
    //         });
    //         const genSyntaxTree = await getSyntaxTree(path, langClient);
    //         const vistedSyntaxTree: STNode = await getLowcodeST(genSyntaxTree, path, langClient, experimentalEnabled, showMessage);
    //         setSyntaxTree(vistedSyntaxTree);
    //         setFileContent(lastsource);
    //         props.updateFileContent(path, lastsource);
    //
    //         await addPerfData(vistedSyntaxTree);
    //
    //     }
    // }

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
                // environment={lowCodeEnvInstance}
                // stSymbolInfo={getSymbolInfo()}
                // tslint:disable-next-line: jsx-no-multiline-js
                currentFile={{
                    content: fileContent,
                    path: filePath,
                    size: 1,
                    type: "File"
                }}
                // importStatements={getImportStatements(fullSyntaxTree)}
                // experimentalEnabled={experimentalEnabled}
                // lowCodeResourcesVersion={lowCodeResourcesVersion}
                // ballerinaVersion={balVersion}
                // isCodeServerInstance={isCodeServer}
                // openInDiagram={openInDiagram}
                // tslint:disable-next-line: jsx-no-multiline-js
                api={{
                    ls: {
                        getDiagramEditorLangClient: () => {
                            return langClientPromise;
                        },
                        getExpressionEditorLangClient: () => {
                            return langClientPromise;
                        }
                    },
                    // insights: {
                    //     onEvent: (event: LowcodeEvent) => {
                    //         props.sendTelemetryEvent(event);
                    //     }
                    // },
                    code: {
                        gotoSource: (position: { startLine: number, startColumn: number }) => {
                            props.gotoSource(filePath, position);
                        },
                        updateFileContent: (content: string, skipForceSave?: boolean) => {
                            return props.updateFileContent(filePath, content, skipForceSave);
                        }
                    }
                    // FIXME Doesn't make sense to take these methods below from outside
                    // Move these inside and get an external API for pref persistance
                    // against a unique ID (eg AppID) for rerender from prev state
                    // panNZoom: {
                    //     pan,
                    //     fitToScreen,
                    //     zoomIn,
                    //     zoomOut
                    // },
                    // webView: {
                    //     showTryitView,
                    //     showDocumentationView
                    // },
                    // project: {
                    //     run
                    // },
                    // library: {
                    //     getLibrariesList,
                    //     getLibrariesData,
                    //     getLibraryData
                    // },
                    // runBackgroundTerminalCommand,
                    // openArchitectureView,
                    // openExternalUrl
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

    // async function addPerfData(vistedSyntaxTree: STNode) {
    //     const currentTime: number = Date.now();
    //     const langClient = await langClientPromise;
    //     if (currentTime - lastPerfUpdate > debounceTime) {
    //         await addPerformanceData(syntaxTree, filePath, langClient, props.showPerformanceGraph, props.getPerfDataFromChoreo, setSyntaxTree);
    //         lastPerfUpdate = currentTime;
    //     }
    // }
}
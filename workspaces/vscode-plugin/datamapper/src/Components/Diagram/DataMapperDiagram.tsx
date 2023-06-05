import React from 'react';
import createEngine, { DiagramModel } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { CustomNodeModel } from '../Nodes/Customs/CustomNodeModel';
import { nodeFactories } from '../Nodes';
import { DefaultState } from '../LinkState/DefaultState';
import { DataMapperLinkFactory } from './../Link/Model/DataMapperLinkFactory';
import { DataMapperLinkModel } from './../Link/Model/DataMapperLinkModel';
import { DataMapperLabelFactory } from './../LinkLabel/DataMapperLabelFactory';
import { portFactories } from '../Port';
import { FileContext } from './../ContextProvider/FileContext';
import { Cached, Delete,FitScreen } from '@mui/icons-material';
import { DiagramStyles } from './styles';
import { Button, Tooltip } from '@mui/material';

export var TotNodes: CustomNodeModel[] = [];
const defaultModelOptions = { zoom: 90 };
interface vscode {
    postMessage(message: any): void;
}
declare const vscode: vscode;

const DataMapperDiagram = () => {
    const classes = DiagramStyles();
    const [engine, setEngine] = React.useState(createEngine({ registerDefaultZoomCanvasAction: true }));
    const [model, setNewModel] = React.useState<DiagramModel>(new DiagramModel());
    const modelRef = React.useRef<DiagramModel>(model);
    const [links, setLinks] = React.useState<DataMapperLinkModel[]>([]);
    const { addedNode, removedNode } = React.useContext(FileContext);

    for (const factory of nodeFactories) { engine.getNodeFactories().registerFactory(factory); }
    for (const factory of portFactories) { engine.getPortFactories().registerFactory(factory); }
    engine.getLinkFactories().registerFactory(new DataMapperLinkFactory());
    engine.getLabelFactories().registerFactory(new DataMapperLabelFactory());
    engine.getStateMachine().pushState(new DefaultState());

    const handleSerialization = ()=>{
        setTimeout(() => {
            const serialized = JSON.stringify(modelRef.current.serialize());
            vscode.postMessage({
                command: 'serializing',
                fileContent: serialized
            });
        }, 1000);
    }

    React.useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data.command === 'serialized') {
                const parsed = JSON.parse(e.data.data);
                model.deserializeModel(parsed, engine);
                setNewModel(model);

                setTimeout(() => {
                    engine.setModel(model);
                }, 0);
                vscode.postMessage({ command: 'success_alert', text: 'diagram updated successfully' });
            }
        };
        vscode.postMessage({ command: "deserializing" });
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [])

    model.registerListener({
        linksUpdated: async (event: any) => {
            const AllLinks = engine.getModel().getLinks().map(link => new DataMapperLinkModel());;
            setLinks(AllLinks);

            const diagramLink: any = [];
            const currentLinks = engine.getModel().getLinks();
            currentLinks.forEach((link) => {
                const Link = {
                    sourcePort: {
                        nodeId: link.getSourcePort()?.getParent()?.getName(),
                        portId: link.getSourcePort()?.getName(),
                        ID: link.getSourcePort()?.getParent()?.getID(),
                        alignment: link.getSourcePort()?.getPortType()
                    },
                    targetPort: {
                        nodeId: link.getTargetPort()?.getParent()?.getName(),
                        portId: link.getTargetPort()?.getName(),
                        ID: link.getTargetPort()?.getParent()?.getID(),
                        alignment: link.getTargetPort()?.getPortType()
                    },
                    isChecked: false,
                    linkId: link.getOptions().id
                };
                diagramLink.push(Link);
            })
            vscode.postMessage({ command: 'DMC', linkData: diagramLink });
        },
    })

    React.useEffect(() => {
        if (model.getLinks().length > 0) {
            engine.repaintCanvas(true);
        }
        handleSerialization();
    }, [links])

    React.useEffect(() => {
        async function genModel() {
            TotNodes = [...TotNodes, ...addedNode];
            const allNodes = [...addedNode];

            if (allNodes.length > 0) {
                const newModel = model.clone();
                newModel.addAll(...allNodes);
                for (const node of allNodes) {
                    try {
                        node.setModel(newModel);
                        await node.initPorts();
                        node.initLinks();
                        engine.repaintCanvas();
                    } catch (e) {
                        console.error(e);
                    }
                }
                newModel.setLocked(false);
                setNewModel(newModel);
                modelRef.current = newModel;
            }
        }
        void genModel();
        handleSerialization();
    }, [addedNode]);

    React.useEffect(() => {
        if (removedNode && model.getNode(removedNode.getID())) {
            model.getLinks().forEach(link => {
                if (link.getSourcePort().getParent() === removedNode || link.getTargetPort().getParent() === removedNode) {
                    model.removeLink(link);
                }
            });
            model.removeNode(removedNode);
        }
        handleSerialization();
    }, [removedNode]);

    const clearDiagram = () => {
        const clearModel = new DiagramModel();
        setNewModel(clearModel);
        setTimeout(() => {
            const serialized = JSON.stringify(clearModel.serialize());
            vscode.postMessage({
                command: 'serializing',
                fileContent: serialized
            });
        }, 1000);
    }

    engine.setModel(model);

    const resetZoomAndOffset = () => {
        const currentModel = engine.getModel();
        currentModel.setZoomLevel(defaultModelOptions.zoom);
        currentModel.setOffset(0, 0);
        engine.setModel(currentModel);
    }

    return (<>
        <div className={classes.clrButtonWrap}>
            <Button onClick={clearDiagram} className={classes.clrButton} variant='contained' endIcon={<Delete className={classes.icon} />}>
                Clear Diagram</Button>
        </div>
        <CanvasWidget className={classes.canvas} engine={engine} />
        <div className={classes.buttonWrap}>
            <Tooltip title="Fit to Screen">
                <div className={classes.iconWrap} onClick={resetZoomAndOffset}>
                    <Cached className={classes.icon} />
                </div>
            </Tooltip>
            <Tooltip title="Zoom">
                <div className={classes.iconWrap} onClick={() => void engine.zoomToFitNodes({ maxZoom: 60 })}>
                    <FitScreen className={classes.icon} />
                </div>
            </Tooltip>
        </div>
    </>)
}

export default React.memo(DataMapperDiagram);
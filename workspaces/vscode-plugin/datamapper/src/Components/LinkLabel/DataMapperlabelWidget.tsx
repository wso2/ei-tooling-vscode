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

import * as React from 'react';
import { Delete } from '@mui/icons-material';
import { DataMapperLabelModel } from './DataMapperLabelModel';
import { Tooltip } from '@mui/material';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { LabelStyles } from './styles';

interface vscode {
    postMessage(message: any): void;
}
declare const vscode: vscode;

export interface DataMapperLabelWidgetProps {
    model: DataMapperLabelModel;
    engine: DiagramEngine;
}

export enum LinkState {
    TemporaryLink,
    LinkSelected,
    LinkNotSelected
}

export const DataMapperLabelWidget: React.FunctionComponent<DataMapperLabelWidgetProps> = (props) => {
    const classes = LabelStyles();
    const { model, engine } = props;
    const [linkStatus, setLinkStatus] = React.useState<LinkState>(LinkState.LinkNotSelected);
    const [deleteInProgress, setDeleteInProgress] = React.useState(false);
    var firstPoint, lastPoint, midX: number = 0, midY: number = 0;

    const labelId = model.getID();
    const link = engine
        .getModel()
        .getLinks()
        .find((link) => link.getLabels().some((label) => label.getID() === labelId));


    if (link) {
        firstPoint = link.getFirstPoint();
        lastPoint = link.getLastPoint();
        midX = (firstPoint.getX() + lastPoint.getX()) / 2;
        midY = (firstPoint.getY() + lastPoint.getY()) / 2;
    }

    const onDelete = (e?: React.MouseEvent<HTMLDivElement>) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        try {
            setDeleteInProgress(true);
            link?.remove();
            vscode.postMessage({ command: 'success_alert', text: 'Link removed successfully' });
        } catch (e) {
            vscode.postMessage({ command: 'fail_alert', text: 'Error, Cant remove link' });
        }
    };

    React.useEffect(() => {
        if (link) {
            link.registerListener({
                selectionChanged: () => {
                    setLinkStatus(link.isSelected() ? LinkState.LinkSelected : LinkState.LinkNotSelected);
                }
            });
        } else {
            setLinkStatus(LinkState.TemporaryLink);
        }
    }, [model]);


    const elements: React.ReactNode[] = [
        (
            <div key="configure">
                <div className={classes.container}>
                    {deleteInProgress ? (
                        <></>) : (
                        <div className={classes.element} onClick={onDelete}>
                            <div className={classes.iconWrapper}>
                                <Tooltip title="Delete">
                                    <Delete className={classes.IconButton} />
                                </Tooltip>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ),
    ];

    return (linkStatus === LinkState.LinkSelected) ? (
        <>
            {elements}
        </>
    ) : (
        <></>
    );
};

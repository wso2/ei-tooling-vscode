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

import * as React from "react";
import { DefaultLinkWidget as ReactDiagramDefaultLinkWidget } from "@projectstorm/react-diagrams";
import { DefaultLinkSegmentWidget } from "../LinkSegment/DataMapperLinkSegments";

// Implementation of the appearence of the customized link.
export class DataMapperLinkWidget extends ReactDiagramDefaultLinkWidget {
    generateLink(
        path: string,
        extraProps: React.Attributes,
        id: string | number
    ): JSX.Element {
        const ref = React.createRef<SVGPathElement>();
        this.refPaths.push(ref);
        return (
            <DefaultLinkSegmentWidget
                key={`link-${id}`}
                path={path}
                selected={this.state.selected}
                diagramEngine={this.props.diagramEngine}
                factory={this.props.diagramEngine.getFactoryForLink(
                    this.props.link
                )}
                link={this.props.link}
                forwardRef={ref}
                onSelection={(selected) => {
                    this.setState({ selected });
                }}
                extras={extraProps}
            />
        );
    }
}

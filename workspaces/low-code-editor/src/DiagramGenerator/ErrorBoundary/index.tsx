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

import { reportErrorWithScope } from "../../utils/sentry";

import ErrorScreen from "./Error";

export interface DiagramGenErrorBoundaryProps {
    lastUpdatedAt: string;
    children: React.ReactElement | React.ReactElement[];
}

export interface DiagramGenErrorBoundaryState {
    hasError: boolean;
    lastUpdatedAt: string;
}

export class DiagramGenErrorBoundaryC extends React.Component<DiagramGenErrorBoundaryProps, DiagramGenErrorBoundaryState> {
    state = { hasError: false, lastUpdatedAt: this.props.lastUpdatedAt }

    static getDerivedStateFromProps(props: DiagramGenErrorBoundaryProps,
                                    state: DiagramGenErrorBoundaryState) {
      return {
        lastUpdatedAt: props.lastUpdatedAt,
        hasError: state.lastUpdatedAt !== props.lastUpdatedAt ? false : state.hasError
      };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
      // tslint:disable: no-console
      console.error(error, errorInfo);
      reportErrorWithScope(error, { errorInfo });
    }

    render() {
      if (this.state.hasError) {
        return <ErrorScreen />;
      }
      return this.props.children;
    }
}

export const DiagramGenErrorBoundary = DiagramGenErrorBoundaryC;

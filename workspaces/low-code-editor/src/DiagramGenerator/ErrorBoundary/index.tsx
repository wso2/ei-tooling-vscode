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

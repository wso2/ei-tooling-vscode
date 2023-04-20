/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
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
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

export interface SentryConfig {
    environment: string;
    dsn: string;
    release: string;
    correlationID: string;
}

export const init = (config: SentryConfig) => {
    const sampleRate = 1;
    if (!config.dsn) return;
    try {
        Sentry.init({
            dsn: "",
            release: process.env.APP_VERSION || "Low-code-default",
            environment: config.environment,
            ignoreErrors: [],
            sampleRate,
            integrations: [new BrowserTracing()],
            tracesSampleRate: 1.0,
        });
        Sentry.setContext("Correlation ID", { id : config.correlationID });
    } catch (e) {
        // tslint:disable: no-console
        console.error(e);
    }
};

export const reportErrorWithScope = (error: any, extraInfo?: any) => {
    Sentry.withScope((scope) => {
        if (extraInfo) scope.setExtras(extraInfo);
        Sentry.captureException(error);
    });
};

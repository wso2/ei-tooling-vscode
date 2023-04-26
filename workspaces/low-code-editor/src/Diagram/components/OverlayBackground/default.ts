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
class DiagramConfig {

    public startingOnErrorX: number = 120;

    public startingOnErrorY: number = 25;

    public startingY: number = 90;

    public dotGap: number = 8;

    public shadow: number = 8;

    public offSet: number = 11.5;

    public epGap: number = 120;
    public connectorEPWidth = 150;

    public horizontalGapBetweenParentComponents: number = 150;

    public horizontalGapBetweenComponents: number = 25;

    public actionArrowPadding: number = 5;

    public actionArrowGap: number = 7.5;

    public elseCurveYOffset: number = 0.56;

    public canvasBottomOffset: number = 100;

    public textAlignmentOffset: number = 40; // This id 5 doted gaps

    public EXISTING_PLUS_HOLDER_API_HEIGHT: number = 612;

    public EXISTING_PLUS_HOLDER_API_HEIGHT_COLLAPSED: number = 660;

    public PLUS_HOLDER_API_HEIGHT : number = 625;

    public PLUS_HOLDER_API_HEIGHT_COLLAPSED: number = 321;

    public PLUS_HOLDER_STATEMENT_HEIGHT: number = 420;

    public PLUS_HOLDER_WIDTH: number = 376;

    public overlayBackground = {
        height: '1000vh',
        width: '1000vw'
    };

    public dropDownMenuOffset = {
        x: (this.dotGap * 7),
        y: - 105 / 2,
    };

    public deleteConfirmOffset = {
        x: - 255,
        y: - (96 / 2),
    };

    public processorDropDownMenuOffset = {
        x: (this.dotGap * 7),
        y: this.dotGap,
    };

    public textLine = {
        height: 4,
        padding: 8,
        width: 64
    };

    public boxRadius = {
        rx: 10,
        ry: 10
    };

    public canvas = {
        x: 0,
        y: 0,
        height: 1000,
        width: 1000,

        servicePaddingX: 100,
        servicePaddingY: 0,

        resourcePaddingX: 200,
        resourcePaddingY: 0,

        childPaddingX: 300,
        childPaddingY: 0,
    };

    public worker = {
        height: 400
    };

    public start = {
        width: 100,
        height: 50
    };

    public stop = {
        width: 100,
        height: 50
    };

    public connectorStart = {
        width: 100,
        height: 50
    };

    public connectorLine = {
        height: 70,
        gap: 10,
    };

    public actionExecution = {
        width: 20,
        height: 70
    };

    public client = {
        radius: 40
    };

    public if = {
        width: 96,
        height: 100,
        scale: 50
    };

    public plus = {
        radius: 12.5
    };

    public plusHolder = {
        width: 396,
        height: 254,
        paddingtop: 20,
        paddingBottom: 19,
        paddingLeft: 22,
        paddingWithoutStop: 30,
        paddingRight: 23,
        radius: 12,
        intialHolderTop: 16,
        intialHolderLeft: 12,
        element: {
            gap: 8,
            width: 80,
            height: 72,
            shadowGap: 11,
            topGap: 7,
        },
    }

    public triggerPortalOffset = {
        x: (this.dotGap * 12),
        y: - (this.start.height / 2),
    };

    public startHoverTriggerPortalOffset = {
        x: (this.dotGap * 27),
        y: - (this.start.height / 2),
    };

    public forEach = {
        radius: 7,
        paddingUnfold: 8,
        emptyHorizontalGap: 48,
        offSet: 13,
    };

    public metrics = {
        successTextPadding: 8,
        responseTimePadding: 8
    }

    public configureWizardOffset = {
        x: 350,
        y: 54,
    };

    public onErrorHeader = {
        h: 100,
        w: 200,
    };

    // service wrapper related stuff
    serviceVerticalPadding = 20; // top/bottom gap between service members
    serviceFrontPadding = 20;
    serviceRearPadding = 20;
    serviceMemberSpacing = 20;

    // function header area height
    functionHeaderHeight = 50;

    // default body sizing
    defaultBlockWidth = 200;
    defaultBlockHeight = this.offSet * 2;

    interactionModeOffset = 4;
}

export const DefaultConfig = new DiagramConfig();

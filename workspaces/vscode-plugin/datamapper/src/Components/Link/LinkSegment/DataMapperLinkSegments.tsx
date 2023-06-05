import * as React from "react";
import { DefaultLinkSegmentWidgetProps } from "@projectstorm/react-diagrams";
import { DataMapperLinkModel } from "../Model/DataMapperLinkModel";
import DataMapperPortModel from "../../Port/DataMapperPort/DataMapperPortModel";

export class DefaultLinkSegmentWidget extends React.Component<DefaultLinkSegmentWidgetProps> {
    render() {
        const isSelected = !(this.props.link as DataMapperLinkModel) &&
            (this.props.selected || this.props.link.isSelected());

        const Bottom = React.cloneElement(
            this.props.factory.generateLinkSegment(
                this.props.link,
                false,
                this.props.path
            ),
            {
                ref: this.props.forwardRef,
                strokeWidth: isSelected ? 2 : 1,
                cursor: !(this.props.link as DataMapperLinkModel) ? "pointer" : "inherit"
            }
        );

        const sourcePortName =
            this.props.link.getSourcePort() instanceof DataMapperPortModel
                ? this.props.link.getSourcePort().getOptions().type
                : this.props.link.getSourcePort().getName();
        const targetPortName =
            this.props.link.getTargetPort() instanceof DataMapperPortModel
                ? this.props.link.getTargetPort().getOptions().type
                : this.props.link.getTargetPort().getName();

        const Top = React.cloneElement(Bottom, {
            strokeLinecap: "round",
            onMouseLeave: () => {
                this.props.onSelection(false);
            },
            onMouseEnter: () => {
                this.props.onSelection(true);
            },
            ...this.props.extras,
            ref: null,
            "data-linkid": this.props.link.getID(),
            "data-testid": `link-from-${sourcePortName}-to-${targetPortName}`,
            strokeOpacity: isSelected ? 0.1 : 0,
            strokeWidth: 10, 
            onContextMenu: () => {
                if (!this.props.link.isLocked()) {
                    this.props.link.remove();
                }
            },
        });

        return (
            <>
                {Bottom}
                {Top}
            </>
        );
    }
}

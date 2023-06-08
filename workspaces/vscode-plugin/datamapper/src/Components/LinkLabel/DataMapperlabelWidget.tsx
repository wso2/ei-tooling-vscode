import { CodeOutlined, Delete } from "@mui/icons-material";
import * as React from "react";
import { DataMapperLabelModel } from "./DataMapperLabelModel";
import { LabelStyles } from "./styles";
import FunctionEditor from "../FunctionEditor/FunctionEditor";
import { Tooltip } from "@mui/material";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import { DataMapperLinkModel } from "../Link/Model/DataMapperLinkModel";

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
  LinkNotSelected,
}

export const DataMapperLabelWidget: React.FunctionComponent<
  DataMapperLabelWidgetProps
> = (props) => {
  const classes = LabelStyles();
  const { model, engine } = props;
  const [linkStatus, setLinkStatus] = React.useState<LinkState>(
    LinkState.LinkNotSelected
  );
  const [deleteInProgress, setDeleteInProgress] = React.useState(false);
  const [editorOpen, setEditorOpen] = React.useState(false);
  var firstPoint,
    lastPoint,
    midX: number = 0,
    midY: number = 0;

  const labelId = model.getID();
  const link = engine
    .getModel()
    .getLinks()
    .find((link) =>
      link.getLabels().some((label) => label.getID() === labelId)
    );

  const dataMapperLink: DataMapperLinkModel = link as DataMapperLinkModel;

  if (link) {
    // firstPoint = link.getSourcePort().getPosition();
    // lastPoint = link.getTargetPort().getPosition();
    midX = (link.getSourcePort().getX() + link.getTargetPort().getX()) / 2;
    midY = (link.getSourcePort().getY() + link.getTargetPort().getY()) / 2;
    console.log("x: ", midX);
    console.log("y : ", midY);
  }

  const onDelete = (e?: React.MouseEvent<HTMLDivElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      setDeleteInProgress(true);
      link?.remove();
      vscode.postMessage({
        command: "success_alert",
        text: "Link removed successfully",
      });
    } catch (e) {
      vscode.postMessage({
        command: "fail_alert",
        text: "Error, Cant remove link",
      });
    }
  };

  const onEdit = (e?: React.MouseEvent<HTMLDivElement>) => {
    setEditorOpen(true);
  };

  React.useEffect(() => {
    if (link) {
      link.registerListener({
        selectionChanged: () => {
          setLinkStatus(
            link.isSelected()
              ? LinkState.LinkSelected
              : LinkState.LinkNotSelected
          );
        },
      });
    } else {
      setLinkStatus(LinkState.TemporaryLink);
    }
  }, [model]);

  const elements: React.ReactNode[] = [
    <div
      key="configure"
      style={{
        position: "absolute",
        left: `${midX}px`,
        top: `${midY}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className={classes.container}>
        <div className={classes.element} onClick={onEdit}>
          <div className={classes.iconWrapper}>
            <Tooltip title="Configure">
              <CodeOutlined className={classes.IconButton} />
            </Tooltip>
          </div>
        </div>
        <div className={classes.separator} />
        {deleteInProgress ? (
          <></>
        ) : (
          <div className={classes.element} onClick={onDelete}>
            <div className={classes.iconWrapper}>
              <Tooltip title="Delete">
                <Delete className={classes.IconButton} />
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    </div>,
    editorOpen && (
      <FunctionEditor
        key="functionEditor"
        onClose={() => setEditorOpen(false)}
        engine={engine}
        link={dataMapperLink}
      />
    ),
  ];

  return linkStatus === LinkState.LinkSelected ? <>{elements}</> : <></>;
};

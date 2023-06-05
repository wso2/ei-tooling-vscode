import { MouseEvent } from 'react';
import { Action, ActionEvent, DragCanvasState, InputType, SelectingState, State } from '@projectstorm/react-canvas-core';
import { DiagramEngine, DragDiagramItemsState, PortModel } from '@projectstorm/react-diagrams-core';
import { CreateLinkState } from './CreateLinkState';
import DataMapperPortModel from '../Port/DataMapperPort/DataMapperPortModel';
import { IntermediatePortModel } from '../Port/IntermediatePort/IntermediatePortModel';
import { DataMapperLinkModel } from '../Link/Model/DataMapperLinkModel';

export class DefaultState extends State<DiagramEngine> {
  createLink: CreateLinkState;
  dragItems: DragDiagramItemsState;

  constructor() {
    super({ name: 'starting-state' });
    this.childStates = [new SelectingState()];
    this.createLink = new CreateLinkState();
    this.dragItems = new DragDiagramItemsState();


    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: (event: ActionEvent<MouseEvent>) => {
          const element = this.engine.getActionEventBus().getModelForEvent(event);
          if (element instanceof DataMapperPortModel || element instanceof IntermediatePortModel) {
            element.setSelected(!element.isSelected());
            console.log("port selection logic");
          // } else if (element instanceof DataMapperLinkModel) {
          //   element.setSelected(!element.isSelected());
          //   console.log("link selection logic");
          // 
        }
          else {
            this.transitionWithEvent(this.dragItems, event);
          }
        }
      })
    );

    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: (event: ActionEvent<MouseEvent>) => {
          const element = this.engine.getActionEventBus().getModelForEvent(event);
          if (element instanceof DataMapperPortModel || element instanceof IntermediatePortModel) {
            if (element.isSelected()) {
              console.log("creating link:");
              this.transitionWithEvent(this.createLink, event);
            } else {
              console.log("port is not selected");
            }
          } 
          //else  if (element instanceof DataMapperLinkModel) {
          //   if (element.isSelected()) {
          //     console.log("Link Selection process:");
          //   } else {
          //     console.log("link is not selected");
          //   }
          // }
        }
      })
    );
  }
}

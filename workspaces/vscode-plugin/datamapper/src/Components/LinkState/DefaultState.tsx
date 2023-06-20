import { MouseEvent } from 'react';
import { Action, ActionEvent, InputType, SelectingState, State } from '@projectstorm/react-canvas-core';
import { DiagramEngine, DragDiagramItemsState } from '@projectstorm/react-diagrams-core';
import { CreateLinkState } from './CreateLinkState';
import DataMapperPortModel from '../Port/DataMapperPort/DataMapperPortModel';
import { IntermediatePortModel } from '../Port/IntermediatePort/IntermediatePortModel';

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
              this.transitionWithEvent(this.createLink, event);
            } 
          }
        }
      })
    );
  }
}

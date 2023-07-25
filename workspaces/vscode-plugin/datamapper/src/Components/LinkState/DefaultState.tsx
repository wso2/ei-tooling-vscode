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

import { Action, InputType, SelectingState, State } from '@projectstorm/react-canvas-core';
import { DiagramEngine, DragDiagramItemsState } from '@projectstorm/react-diagrams-core';
import { CreateLinkState } from './CreateLinkState';
import DataMapperPortModel from '../Port/DataMapperPort/DataMapperPortModel';
import { IntermediatePortModel } from '../Port/IntermediatePort/IntermediatePortModel';

// Track the selection of ports.
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
        fire: (event: any) => {
          const element = this.engine.getActionEventBus().getModelForEvent(event);
          if (element instanceof DataMapperPortModel || element instanceof IntermediatePortModel) {
            element.setSelected(!element.isSelected());
        }else {
            this.transitionWithEvent(this.dragItems, event);
          }
        }
      })
    );

    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: (event:any) => {
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

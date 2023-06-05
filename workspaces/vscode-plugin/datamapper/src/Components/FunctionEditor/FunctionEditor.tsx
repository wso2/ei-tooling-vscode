import { Close, ExpandMore, FolderOpenOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import * as React from 'react';
import { FunctionStyles } from './styles';
import { FileContext } from './../ContextProvider/FileContext';
import { CustomNodeModel } from '../Nodes/Customs/CustomNodeModel';
import { DataMapperLinkModel } from '../Link/Model/DataMapperLinkModel';
import { JoinNodeModel } from '../Nodes/Boolean_StringJoin/JoinNodeModel';
import { InputsNodeModel } from '../Nodes/InputsNodes/InputsNodeModel';
import { TransformNodeModel } from '../Nodes/String_Transform_TypeConversion/TransformNodeModel';
import { SplitNodeModel } from '../Nodes/String/Split/SplitNodeModel';
import { SubStringNodeModel } from '../Nodes/String/SubString/SubStringNodeModel';
import { FunctionData as data } from './FunctionEditorData';

export interface FunctionEditorProps {
  onClose: () => void;
  engine: DiagramEngine;
  link?: DataMapperLinkModel;
}

const FunctionEditor: React.FunctionComponent<FunctionEditorProps> = (props) => {
  const { onClose, link } = props;
  const classes = FunctionStyles();
  const { setAddedNode } = React.useContext(FileContext);
  const IntermediateNodes: CustomNodeModel[] = [];

  var firstPoint, lastPoint, midX: number, midY: number;
  if (link) {
    firstPoint = link.getFirstPoint();
    lastPoint = link.getLastPoint();
    midX = (firstPoint.getX() + lastPoint.getX()) / 2;
    midY = (firstPoint.getY() + lastPoint.getY()) / 2;
  }

  const handleNode = (operation: String) => {
    var commonNode: CustomNodeModel;
    switch (operation) {
      case 'Concat':
      case 'EndsWith':
      case 'StartsWith':
      case 'Match':
      case 'AND':
      case 'OR':
      case 'Add':
      case 'Subtract':
      case 'Multiply':
      case 'Division':
      case 'Set Precision':
      case 'Min':
      case 'Max':
      case 'Compare':
        {
          commonNode = new JoinNodeModel({ name: operation });
          break;
        }
      case 'UpperCase':
      case 'LowerCase':
      case 'Trim':
      case 'StringLength':
      case 'ToString':
      case 'StringToBoolean':
      case 'StringToNumber':
      case 'NOT':
      case 'Ceiling':
      case 'Floor':
      case 'Round':
      case 'AbsoluteValue':
        {
          commonNode = new TransformNodeModel({ name: operation });
          break;
        }
      case 'Split':
        {
          commonNode = new SplitNodeModel({ name: operation });
          break;
        }
      case 'SubString':
      case 'Replace':
      case 'IfElse':
        {
          commonNode = new SubStringNodeModel({ name: operation });
          break;
        }
      default:
        {
          commonNode = new InputsNodeModel({ name: operation });
        }
    }

    link?.remove();
    commonNode.setPosition(midX, midY);
    IntermediateNodes.push(commonNode);
    setAddedNode(IntermediateNodes);
  }

  return (
    <Drawer anchor="right" open={true} onClose={onClose}>
      <List className={classes.header}>
        <ListItem button onClick={onClose}>
          <ListItemText primary="Close" className={classes.ListItemText} /><Close />
        </ListItem>
      </List>

      <div>
        {data.map((item, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMore />} className={classes.accordian}>
              <FolderOpenOutlined /><Typography>{Object.keys(item)[0]}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {Object.values(item)[0].map((value: any, i: any) => (
                  <div key={i}  onClick={() => handleNode(value)} className={classes.text}>{value} </div>
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

    </Drawer>
  );
};

export default FunctionEditor;

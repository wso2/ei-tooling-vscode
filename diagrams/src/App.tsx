import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import './App.css';

import { FileNode, root } from './data';


type Props = {
  node: FileNode,
  add?: React.Dispatch<React.SetStateAction<FileNode>>
}

const File = (props: Props) => {


  const [showChildren, setShowChildren] = useState<boolean>(false);

  // const [addedNode, setAddedNode] = useState<FileNode>();
  const [node, setNode] = useState<FileNode>(props.node);


  const handleClick = useCallback(() => {

    // console.log(props.topNode);
    // console.log(node.selection);

    if (node.selection) {


      props.add && props.add(state => {

        // console.log("oldNode.current: ", oldNode.current)
        const newNode: FileNode = { ...state, children: [{ ...node, selection: false }] } as FileNode;
        return newNode;
      })

    } else {

      setShowChildren(() => {
        return !showChildren
      });
    }


  }, [showChildren, setShowChildren, node, props])

  // console.log(node)

  return (
    <div>
      <TextButton onClick={() => node.selection ? handleClick() : null} >

        {node.id}
        {!node.selection ?
          <PlusButton onClick={() => {
            handleClick()
          }

          }>{showChildren ? "-" : "+"}</PlusButton> : ""
        }
      </TextButton>
      <DisplayDiv>
        {
          showChildren && (node.children ?? []).map((childNode: FileNode) => (
            <>
              {!childNode.selection ? <>
                <BoxDiv>

                  <File node={{ ...childNode }} add={setNode} />

                </BoxDiv>
              </>
                : <>
                  <SelectList>
                    <File node={{ ...childNode }} add={setNode} />
                  </SelectList>
                </>}

            </>
          ))
        }
      </DisplayDiv>
    </div>
  )
}

function App() {
  return (
    <div style={{ marginLeft: 15 }}>

      {root.dataList && root.dataList.map(data => {
        return (
          <BoxDiv>
            <File node={{ ...data }} />
          </BoxDiv>)
      }
      )}

    </div>
  );
}

export default App;

const PlusButton = styled.div`
  cursor: pointer;
  display: inline-block;
`;

const TextButton = styled.div`

`;

const DisplayDiv = styled.div`
  position: relative;
  display: block;
  flexDirection: column;
  left: 25;
  // border-left: 1px solid;
  paddingLeft: 15; `;


const BoxDiv = styled.div`
  border: 2px solid;
  padding:10px;
  margin-top:50px;
  margin-right: 15px;

  `;

const SelectList = styled.div`
  display:inline-block;
  border: 1px solid;
`;
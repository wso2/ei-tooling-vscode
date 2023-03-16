import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import './App.css';

import { FileNode, root } from './data';


type Props = {
  node: FileNode,
  add?: Function
}

const File = (props: Props) => {


  const [showChildren, setShowChildren] = useState<boolean>(false);

  const [addedNode, setAddedNode] = useState<FileNode>();

  const addFun = (data: FileNode) => {
    setAddedNode(
      () => {
        console.log(data);
        return data;
      }

    )
  }

  const handleClick = useCallback(() => {


    //todo: need to pass this to next level to get data
    props.node.selection ?
      props.add && props.add(() => {
        console.log(props.node);
        return props.node;
      })

      :
      setShowChildren(!showChildren);


  }, [showChildren, setShowChildren, props.node])

  return (
    <div>
      <TextButton onClick={() => props.node.selection ? handleClick() : null} >

        {props.node.id}
        {!props.node.selection ?
          <PlusButton onClick={() =>
            handleClick()

          }>{showChildren ? "-" : "+"}</PlusButton> : ""
        }
      </TextButton>
      <DisplayDiv>
        {
          showChildren && (props.node.children ?? []).map((node: FileNode) => (
            <>
              {!node.selection ? <>
                <BoxDiv>
                  {addedNode ?
                    //todo: need to call addFun
                    <File node={{ ...addedNode }} add={() => addFun(props.node)} />
                    : <File node={{ ...node }} />}

                </BoxDiv>
              </>
                : <>
                  <SelectList>
                    <File node={{ ...node }} add={() => addFun(props.node)} />
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
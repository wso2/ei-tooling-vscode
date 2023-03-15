import React, { useCallback, useState } from 'react';
import './App.css';

import { FileNode, root } from './data';

const File: React.FC<FileNode> = ({ id, children }: FileNode) => {
  const [showChildren, setShowChildren] = useState<boolean>(false);
  const handleClick = useCallback(() => {
    setShowChildren(!showChildren);
  }, [showChildren, setShowChildren])

  return (
    <div>
      <span onClick={handleClick}>
        <h4 style={{ fontWeight: showChildren ? 'bold' : 'normal' }}>{id}</h4>
      </span>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', left: 25, borderLeft: '1px solid', paddingLeft: 15 }}>
        {showChildren && (children ?? []).map((node: FileNode) => <File {...node}/>)}
      </div>
    </div>
  )
}

function App() {
  return (
    <div style={{ marginLeft: 15 }}>
      <File {...root}/>
    </div>
  );
}

export default App;

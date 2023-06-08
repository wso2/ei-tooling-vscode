import "./App.css";
import FileContextProvider from "./Components/ContextProvider/FileContextProvider";
import DataMapper from "./Components/DataMapper";

function App() {
  return (
    <FileContextProvider>
      <DataMapper />
    </FileContextProvider>
  );
}

export default App;

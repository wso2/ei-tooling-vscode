import React from 'react';
import logo from './logo.svg';
import './App.css';
import {AppContextProvider} from "./contexts/AppContext";
import { Home } from './Home';

function App() {
  return (
      <AppContextProvider>
        <Home />
      </AppContextProvider>
  );
}

export default App;

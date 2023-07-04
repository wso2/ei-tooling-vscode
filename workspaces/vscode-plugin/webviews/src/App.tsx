import { NewIntegrationWizard } from './components/NewIntegrationWizard'; 
import { GettingStarted } from './components/GettingStarted';
import { SampleWizard } from './components/SampleWizard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = themeColour === 'dark' ? createTheme({ palette: { mode: 'dark' } }) : createTheme({ palette: { mode: 'light' } });

function getComponent() {
  switch (pageName) {
    case 'NewIntegrationWizard':
      return <NewIntegrationWizard />;
    case 'GettingStarted':
      return <GettingStarted />;
    case 'SampleWizard':
        return <SampleWizard />;
    default:
      return null;
  }
}

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {getComponent()}
      </ThemeProvider>
    </div>
  );
}

export default App;

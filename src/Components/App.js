import logo from '../logo.svg';
import '../App.css';
import { createTheme, Grid, Paper, ThemeProvider } from '@mui/material';
import { dark } from '@mui/material/styles/createPalette';

const theme = createTheme({
  palette: {
    primary: {
		light:"#426915",
		dark:"#a7d474",
      	main: '#23370b',
    },
    secondary: {
		light:"#57624a",
		dark:"#bfcbad",
      	main: '#3c4433',
    },
	error: {
		light: "#ba1a1a",
		dark: "#ffb4ab",
		main: "#f44336"
	},
	accent: {
		main: "#386663",
		light: "#386663",
		dark: "#a0cfcc"
	}
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    fontSize: 16,
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
            <header className="App-header">
				<Paper>
					<p>asdfhjasdhfkjasdhfjkas</p>
				</Paper>
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
          </div>
    </ThemeProvider>
    
  );
}

export default App;

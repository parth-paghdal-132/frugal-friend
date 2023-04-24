import "../App.css";
import { createTheme,ThemeProvider, } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Navbar from "./Navbar";
import Tracking from './Tracking';
import Home from "./Home";
import Logout from "./Logout";
import MyProfile from "./MyProfile";
import UsersProfile from "./UsersProfile";
import Budget from "./Budget";

const theme = createTheme({
  palette: {
    primary: {
      light: "#426915",
      dark: "#a7d474",
      main: "#23370b",
    },
    onPrimary: {
      light: "#ffffff",
      main: "#ffffff",
      dark: "#1e3700",
    },
    secondary: {
      light: "#57624a",
      dark: "#bfcbad",
      main: "#3c4433",
    },
    onSecondary: {
      light: "#ffffff",
      dark: "#2a331e",
      main: "#ffffff",
    },
    tertiary: {
      main: "#386663",
      light: "#386663",
      dark: "#a0cfcc",
    },
    onTertiary: {
      main: "#ffffff",
      light: "#ffffff",
      dark: "#003735",
    },
    error: {
      light: "#ba1a1a",
      dark: "#ffb4ab",
      main: "#f44336",
    },
    onError: {
      light: "#ffffff",
      main: "#ffffff",
      dark: "#ffffff",
    },
    primaryContainer: {
      light: "#c2f18d",
      main: "#c2f18d",
      dark: "#2d5000",
    },
    onPrimaryContainer: {
      light: "#0f2000",
      main: "#0f2000",
      dark: "#0f2000",
    },
    secondaryContainer: {
      light: "#dbe7c8",
      main: "#dbe7c8",
      dark: "#404a33",
    },
    onSecondaryContainer: {
      light: "#151e0b",
      main: "#151e0b",
      dark: "#dbe7c8",
    },
    tertiaryContainer: {
      light: "#bbece8",
      main: "#bbece8",
      dark: "#bbece8",
    },
    onTertiaryContainer: {
      light: "#00201f",
      main: "#00201f",
      dark: "#bbece8",
    },
    errorContainer: {
      light: "#ffdad6",
      main: "#ffdad6",
      dark: "#93000a",
    },
    onErrorContainer: {
      light: "#410002",
      main: "#410002",
      dark: "#ffdad6",
    },
    background: {
      light: "#fdfcf5",
      main: "#fdfcf5",
      dark: "#fdfcf5",
    },
    onBackground: {
      light: "#1b1c18",
      main: "#1b1c18",
      dark: "#e3e3db",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    fontSize: 16,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <header className="App-header">
            <Navbar />
          </header>
        </div>
        <div>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/myProfile" element={<MyProfile />} />
            <Route path="/user-profile/:userId" element={<UsersProfile />} />
            <Route path='/Tracking' element={<Tracking />} />
            <Route path='/budget' element={<Budget />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

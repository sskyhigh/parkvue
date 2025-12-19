// theme/index.js
import { createTheme, alpha } from "@mui/material/styles";

// Shared style foundation
const base = {
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },  
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.5 },
  },
};

export const darkTheme = createTheme({
  ...base,
  palette: {
    mode: "dark",
    background: {
      default: "#0f0f15", // darker, modern slate black
      paper: "#1a1a23",   // subtle contrast for cards
    },
    text: {
      primary: "#ffffff",
      secondary: alpha("#ffffff", 0.75),
    },
    primary: { main: "#009fb4ff" },  // accent color
    secondary: { main: "#FF6584" }, // secondary accent
    info: { main: "#018091ff" }, // modern cyan-ish
  },
  customStyles: {
    cardGlass: {
      background: alpha("#a7a4a4ff", 0.05), // softer glass
      border: `1px solid ${alpha("#ffffff", 0.12)}`,
      backdropFilter: "blur(14px)",
      boxShadow: `0 8px 24px ${alpha("#000", 0.3)}`, // subtle shadow
    },
    neonGradient: "linear-gradient(135deg, #053847f6, #030916f3)",
    heroBackground: "linear-gradient(135deg, #1a1a25e1, #1c1c2cff, #0e0e20e7)",
  },
});

export const lightTheme = createTheme({
  ...base,
  palette: {
    mode: "light",
    background: {
      default: "#f8f8fb", // soft, eye-friendly light
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a23", // dark but soft
      secondary: "#55565f", // muted secondary text
    },
    primary: { main: "#0fbbffff" },
    secondary: { main: "#FF6584" },
    info: { main: "#02c9e4ff" },
  },
  customStyles: {
    cardGlass: {
      background: alpha("#ffffff", 0.6), // subtle transparency
      border: `1px solid ${alpha("#000", 0.08)}`,
      backdropFilter: "blur(12px)",
      boxShadow: `0 4px 16px ${alpha("#000", 0.08)}`, // light shadow
    },
    neonGradient: "linear-gradient(135deg, #4ec3faff, #058f65ff)",
    heroBackground: "linear-gradient(135deg, #6e6e83ff, #c2c2f3ff, #6783a1ff)",
  },
});

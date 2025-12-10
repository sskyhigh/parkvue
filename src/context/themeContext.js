// context/ThemeContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import { lightTheme, darkTheme } from "../theme";

const ThemeContext = createContext();

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("system"); // "light" | "dark" | "system"
  const [theme, setTheme] = useState(lightTheme);

  const applyTheme = (selectedMode) => {
    if (selectedMode === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? darkTheme : lightTheme);
      return;
    }
    setTheme(selectedMode === "dark" ? darkTheme : lightTheme);
  };

  useEffect(() => {
    const saved = localStorage.getItem("ui-theme");
    if (saved) setMode(saved);
  }, []);

  useEffect(() => {
    applyTheme(mode);
    localStorage.setItem("ui-theme", mode);
  }, [mode]);

  const toggleTheme = (newTheme) => {
    setMode(newTheme);
  };

  const value = {
    mode,
    theme,
    setMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

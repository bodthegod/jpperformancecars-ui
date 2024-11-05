// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#444444",
    },
    secondary: {
      main: "#ffc900",
    },
    error: {
      main: "#d32f2f",
    },
    background: {
      default: "#121212",
    },
  },
  typography: {
    fontFamily: "Monserrat, sans-serif",
  },
});

export default theme;

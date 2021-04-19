import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const Theme = ({ children }) => {
  const theme = createMuiTheme({
    props: {
      MuiTextField: {
        variant: "outlined",
        InputLabelProps: { shrink: true },
        inputProps: { autoSave: "false" },
      },
      MuiButton: {},
      MuiChip: {},
      MuiTypography: {
        component: "div",
      },
      MuiInputBase: {
        style: {
          backgroundColor: "#FFF",
        },
      },
    },
    overrides: {},
    palette: {
      primary: {
        main: "#009688",
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;

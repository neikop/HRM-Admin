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
      MuiChip: {
        variant: "outlined",
      },
      MuiAvatar: {
        variant: "rounded",
      },
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
        main: "#fbc02d",
      },
      secondary: {
        main: "#1890ff",
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;

import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { common } from "@material-ui/core/colors";

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
          backgroundColor: common.white,
        },
      },
    },
    typography: {
      subtitle1: {
        fontWeight: 500,
        lineHeight: 1.5,
      },
      subtitle2: {
        fontWeight: 500,
        lineHeight: 1.43,
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

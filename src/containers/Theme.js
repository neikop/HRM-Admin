import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const Theme = ({ children }) => {
  const theme = createMuiTheme({
    props: {
      MuiTextField: {
        InputLabelProps: { shrink: true },
        fullWidth: true,
      },
      MuiChip: {
        variant: "outlined",
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;

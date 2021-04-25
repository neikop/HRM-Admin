import { Button } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const ColorButton = ({ color, ...props }) => {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: color,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Button color="primary" {...props} />
    </ThemeProvider>
  );
};

export default ColorButton;

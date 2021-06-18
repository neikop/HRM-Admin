import React from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "containers";
import { Box, Typography } from "@material-ui/core";
import { t } from "utils/common";
import { privateRoute } from "routes";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { isError: true };
  }

  render() {
    if (this.state.isError) {
      return (
        <div className="App Private-Layout">
          <AppHeader />
          <div className="App-Body">
            <Box mt={10} textAlign="center">
              <Typography>{t("There are some errors occurred")}</Typography>
              <Typography gutterBottom>{t("Please try again later")}</Typography>
              <Typography
                component={Link}
                to={privateRoute.home.path}
                onClick={() => {
                  this.setState({ isError: false });
                }}>
                {t("Back to")} {t("Home")}
              </Typography>
            </Box>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

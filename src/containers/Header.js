import React from "react";
import { Button, Paper } from "@material-ui/core";
import { browserHistory } from "utils/history";
import { authRoute } from "routes";

const Header = () => {
  const handleClickLogout = () => {
    browserHistory.replace(authRoute.login.path);
  };

  return (
    <Paper square className="App-Header">
      <Button style={{ marginLeft: "auto" }} onClick={handleClickLogout}>
        LOGOUT
      </Button>
    </Paper>
  );
};

export default Header;

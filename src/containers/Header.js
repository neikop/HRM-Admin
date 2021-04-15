import React from "react";
import { Button, Paper } from "@material-ui/core";
import { profileAction } from "actions/profile";
import { AppMenu } from "containers";

const Header = () => {
  const handleClickLogout = () => {
    profileAction.logout();
    localStorage.removeItem("hrm.admin.user");
  };

  return (
    <Paper square className="App-Header">
      <AppMenu />
      <div className="flex-1" />
      <Button onClick={handleClickLogout}>LOGOUT</Button>
    </Paper>
  );
};

export default Header;

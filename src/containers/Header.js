import React from "react";
import { Button, Paper } from "@material-ui/core";
import { profileAction } from "actions/profile";
import { AppMenu } from "containers";
import { t } from "utils/common";

const Header = () => {
  const handleClickLogout = () => {
    profileAction.logout();
  };

  return (
    <Paper square className="App-Header">
      <AppMenu />
      <div className="flex-1" />
      <Button onClick={handleClickLogout}>{t("Logout")}</Button>
    </Paper>
  );
};

export default Header;

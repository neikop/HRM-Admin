import React from "react";
import { AppMenu } from "containers";
import { Darkmode, LanguageBar } from "components";
import { Avatar, IconButton, Paper, Divider, List, ListItem, ListItemText } from "@material-ui/core";
import { profileAction } from "actions/profile";
import { t } from "utils/common";
import { Link } from "react-router-dom";
import { privateRoute } from "routes";
import { Dropdown } from "antd";

const Header = () => {
  const handleClickLogout = () => {
    profileAction.logout();
  };

  return (
    <Paper square className="App-Header">
      <AppMenu />
      <div className="flex-1" />
      <LanguageBar init />
      <div className="mr-8" />
      <Darkmode init />

      <Dropdown
        trigger="click"
        placement="bottomRight"
        overlay={
          <List component={Paper} style={{ width: 240, marginTop: 4 }}>
            <ListItem button component={Link} to={privateRoute.profile.path}>
              <ListItemText>{t("Profile")}</ListItemText>
            </ListItem>
            <Divider />
            <ListItem button onClick={handleClickLogout}>
              <ListItemText>{t("Logout")}</ListItemText>
            </ListItem>
          </List>
        }>
        <IconButton style={{ padding: 8 }}>
          <Avatar variant="circular" style={{ width: 36, height: 36 }} />
        </IconButton>
      </Dropdown>
    </Paper>
  );
};

export default Header;

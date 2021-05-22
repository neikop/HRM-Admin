import React from "react";
import { Link } from "react-router-dom";
import { AppMenu } from "containers";
import { Darkmode, LanguageBar } from "components";
import { Avatar, IconButton, Paper, Divider, List, ListItem, ListItemText } from "@material-ui/core";
import { Dropdown } from "antd";
import { profileAction } from "actions/profile";
import { t } from "utils/common";
import { privateRoute } from "routes";
import { NotificationPopup } from "views/Notification/Popup";

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
      <NotificationPopup />

      <Dropdown
        trigger="click"
        placement="bottomRight"
        getPopupContainer={(event) => event.parentNode}
        overlay={
          <div>
            <List component={Paper} style={{ width: 240, marginTop: 4 }}>
              <ListItem button component={Link} to={privateRoute.profile.path}>
                <ListItemText>{t("Profile")}</ListItemText>
              </ListItem>
              <Divider />
              <ListItem button onClick={handleClickLogout}>
                <ListItemText>{t("Logout")}</ListItemText>
              </ListItem>
            </List>
          </div>
        }>
        <IconButton style={{ padding: 8 }}>
          <Avatar variant="circular" style={{ width: 36, height: 36 }} />
        </IconButton>
      </Dropdown>
    </Paper>
  );
};

export default Header;

import React from "react";
import { Link } from "react-router-dom";
import { AppMenu } from "containers";
import { Darkmode, LanguageBar } from "components";
import { Avatar, IconButton, Paper, Divider, List, ListItem, ListItemText, Hidden, Drawer } from "@material-ui/core";
import { Dropdown } from "antd";
import { profileAction } from "actions/profile";
import { t } from "utils/common";
import { privateRoute } from "routes";
import { NotificationPopup } from "views/Notification/Popup";

import MenuOutlinedIcon from "@material-ui/icons/MenuOutlined";

const Header = () => {
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const handleOpenMenu = (open) => (event) => setIsOpenMenu(open);

  const handleClickLogout = () => {
    profileAction.logout();
  };

  return (
    <Paper square className="App-Header">
      <Hidden smDown>
        <AppMenu />
      </Hidden>
      <Hidden mdUp>
        <IconButton onClick={handleOpenMenu(true)}>
          <MenuOutlinedIcon />
        </IconButton>
        <Drawer open={isOpenMenu} onClose={handleOpenMenu(false)}>
          <List style={{ width: 240 }}>
            <AppMenu onClickMenu={handleOpenMenu(false)} />
          </List>
        </Drawer>
      </Hidden>

      <div className="flex-1 mr-8" />
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
            <List disablePadding component={Paper} style={{ width: 240, marginTop: 4 }}>
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

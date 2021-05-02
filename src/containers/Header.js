import React from "react";
import { AppMenu } from "containers";
import { Darkmode, LanguageBar } from "components";
import { Avatar, IconButton, Paper, Popper } from "@material-ui/core";
import { ClickAwayListener, Divider, List, ListItem, ListItemText } from "@material-ui/core";
import { profileAction } from "actions/profile";
import { t } from "utils/common";
import { Link } from "react-router-dom";
import { privateRoute } from "routes";

const Header = () => {
  const [anchorUser, setAnchorUser] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClickUser = (event) => {
    setAnchorUser(event.currentTarget);
    setIsOpen((open) => !open);
  };

  const handleClickLogout = () => {
    profileAction.logout();
  };

  return (
    <Paper square className="App-Header">
      <AppMenu />
      <div className="flex-1" />
      <LanguageBar />
      <Darkmode />

      <IconButton onClick={handleClickUser} style={{ padding: 8 }}>
        <Avatar variant="circular" style={{ width: 36, height: 36 }} />
      </IconButton>
      <Popper disablePortal placement="bottom-end" open={isOpen} anchorEl={anchorUser}>
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
          <List component={Paper} style={{ width: 240, marginTop: 12 }}>
            <ListItem button component={Link} to={privateRoute.profile.path} onClick={handleClose}>
              <ListItemText>{t("Profile")}</ListItemText>
            </ListItem>
            <Divider />
            <ListItem button onClick={handleClickLogout}>
              <ListItemText>{t("Logout")}</ListItemText>
            </ListItem>
          </List>
        </ClickAwayListener>
      </Popper>
    </Paper>
  );
};

export default Header;

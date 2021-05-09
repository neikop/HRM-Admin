import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button, Paper, Popper, Typography, ClickAwayListener, List, ListItem } from "@material-ui/core";
import { coreuiAction } from "actions/coreui";

import ArrowDropDownOutlinedIcon from "@material-ui/icons/ArrowDropDownOutlined";

export const LANGUAGE_BARS = [
  { id: 1, name: "English", code: "en", width: 116.1 },
  { id: 2, name: "Tiếng Việt", code: "vi", width: 132.7 },
];

const LanguageBar = () => {
  const { language } = useSelector(({ coreui }) => coreui);
  const { i18n } = useTranslation();

  const [anchorUser, setAnchorUser] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClickUser = (event) => {
    setAnchorUser(event.currentTarget);
    setIsOpen((open) => !open);
  };

  const handleChangeLanguage = (code) => {
    coreuiAction.updateLanguage(code);
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  const languageChoose = LANGUAGE_BARS.find((item) => item.code === language) || LANGUAGE_BARS[0];

  return (
    <>
      <Button variant="outlined" endIcon={<ArrowDropDownOutlinedIcon />} onClick={handleClickUser}>
        {languageChoose.name}
      </Button>
      <Popper disablePortal placement="bottom-end" open={isOpen} anchorEl={anchorUser}>
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
          <List component={Paper} style={{ width: languageChoose.width, marginTop: 12 }}>
            {LANGUAGE_BARS.map((item) => (
              <ListItem
                key={item.id}
                button
                selected={item.code === languageChoose.code}
                onClick={() => handleChangeLanguage(item.code)}>
                <Typography variant="button">{item.name}</Typography>
              </ListItem>
            ))}
          </List>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default LanguageBar;

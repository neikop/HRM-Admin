import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button, Paper, Typography, List, ListItem } from "@material-ui/core";
import { Dropdown } from "antd";
import { coreuiAction, LANGUAGE } from "actions/coreui";

import TranslateOutlinedIcon from "@material-ui/icons/TranslateOutlined";
import ArrowDropDownOutlinedIcon from "@material-ui/icons/ArrowDropDownOutlined";

export const LANGUAGE_BARS = [
  { id: 1, name: "English", code: "en" },
  { id: 2, name: "Tiếng Việt", code: "vi" },
];

const LanguageBar = ({ init }) => {
  const { language } = useSelector(({ coreui }) => coreui);
  const { i18n } = useTranslation();

  const handleChangeLanguage = (code) => {
    coreuiAction.updateLanguage(code);
    i18n.changeLanguage(code);
  };

  React.useEffect(() => {
    if (init) {
      const language = LANGUAGE_BARS.find((item) => item.code === localStorage.getItem(LANGUAGE)) || LANGUAGE_BARS[0];
      coreuiAction.updateLanguage(language.code);
      i18n.changeLanguage(language.code);
    }
  }, [init, i18n]);

  const languageChoose = LANGUAGE_BARS.find((item) => item.code === language) || LANGUAGE_BARS[0];

  return (
    <Dropdown
      trigger="click"
      placement="bottomRight"
      getPopupContainer={(event) => event.parentNode}
      overlay={
        <div>
          <List disablePadding component={Paper} style={{ marginTop: 12 }}>
            {LANGUAGE_BARS.map((item) => (
              <ListItem
                key={item.id}
                button
                selected={item.code === languageChoose.code}
                onClick={() => handleChangeLanguage(item.code)}>
                <Typography component="code" variant="overline" className="mr-8">
                  {item.code}
                </Typography>
                <Typography variant="button">{item.name}</Typography>
              </ListItem>
            ))}
          </List>
        </div>
      }>
      <Button
        variant="outlined"
        style={{ whiteSpace: "nowrap", minWidth: 150 }}
        startIcon={<TranslateOutlinedIcon />}
        endIcon={<ArrowDropDownOutlinedIcon />}>
        {languageChoose.name}
      </Button>
    </Dropdown>
  );
};

export default LanguageBar;

import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button, Menu, ListItem, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { activeTheme } from "containers/Menu";
import { coreuiAction } from "redux/actions/coreui";

import LanguageOutlinedIcon from "@material-ui/icons/LanguageOutlined";
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";

export const LANGUAGE_BARS = [
  { id: 1, name: "English", code: "en", width: 140 },
  { id: 2, name: "Tiếng Việt", code: "vi", width: 156 },
];

const LanguageBar = () => {
  const { language } = useSelector(({ coreui }) => coreui);
  const { i18n } = useTranslation();

  const handleClickLanguage = ({ code }) => (event) => {
    handleCloseBar();

    if (code === language) return;
    coreuiAction.updateLanguage(code);
    i18n.changeLanguage(code);
  };

  const languageChoose = LANGUAGE_BARS.find((item) => item.code === language) || LANGUAGE_BARS[0];

  const LanguageItem = React.forwardRef(({ item }, ref) => {
    const isActive = languageChoose.code === item.code;
    const ColorListItem = withStyles(activeTheme(isActive))(ListItem);
    return (
      <ColorListItem ref={ref} onClick={handleClickLanguage(item)} style={{ width: languageChoose.width }}>
        <Typography component="code">{item.code}</Typography>
        {item.name}
      </ColorListItem>
    );
  });

  const [anchorBar, setAnchorBar] = React.useState(null);
  const handleClickBar = (event) => setAnchorBar(event.currentTarget);
  const handleCloseBar = () => setAnchorBar(null);

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<LanguageOutlinedIcon />}
        endIcon={<ExpandMoreOutlinedIcon />}
        onClick={handleClickBar}>
        {languageChoose.name}
      </Button>

      <Menu
        className="Language-menu-container"
        anchorEl={anchorBar}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        open={Boolean(anchorBar)}
        onClose={handleCloseBar}>
        {LANGUAGE_BARS.map((item, index) => (
          <LanguageItem item={item} key={index} />
        ))}
      </Menu>
    </>
  );
};

export default LanguageBar;

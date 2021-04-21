import React from "react";
import { useSelector } from "react-redux";
import { IconButton, Tooltip } from "@material-ui/core";
import { coreuiAction } from "actions/coreui";
import { enable as enableDarkMode, disable as disableDarkMode, setFetchMethod } from "darkreader";
import { t } from "utils/common";

import Brightness4OutlinedIcon from "@material-ui/icons/Brightness4Outlined";
import Brightness5OutlinedIcon from "@material-ui/icons/Brightness5TwoTone";

export const THEME_BARS = [
  { id: 1, name: "Light Mode", code: "light" },
  { id: 2, name: "Dark Mode", code: "dark" },
];

export const handleChangeMode = (isDark) => {
  if (isDark) {
    coreuiAction.updateDarkmode(THEME_BARS[0].code);
    disableDarkMode();
  } else {
    coreuiAction.updateDarkmode(THEME_BARS[1].code);
    setFetchMethod(window.fetch);
    enableDarkMode({ contrast: 90, sepia: 10 });
  }
};

const Darkmode = () => {
  const { darkmode } = useSelector(({ coreui }) => coreui);

  const handleClickBar = (isDark) => (event) => {
    handleChangeMode(isDark);
  };

  const themeChoose = THEME_BARS.find((item) => item.code === darkmode) || THEME_BARS[0];
  const isDark = themeChoose.code === THEME_BARS[1].code;
  return (
    <Tooltip title={t("Toggle Dark Mode")}>
      <IconButton onClick={handleClickBar(isDark)}>
        {isDark ? <Brightness4OutlinedIcon /> : <Brightness5OutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default Darkmode;

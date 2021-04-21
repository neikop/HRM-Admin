import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Select, MenuItem } from "@material-ui/core";
import { coreuiAction } from "actions/coreui";

export const LANGUAGE_BARS = [
  { id: 1, name: "English", code: "en" },
  { id: 2, name: "Tiếng Việt", code: "vi" },
];

const LanguageBar = () => {
  const { language } = useSelector(({ coreui }) => coreui);
  const { i18n } = useTranslation();

  const handleChangeLanguage = (event) => {
    const { value: code } = event.target;
    coreuiAction.updateLanguage(code);
    i18n.changeLanguage(code);
  };

  const languageChoose = LANGUAGE_BARS.find((item) => item.code === language) || LANGUAGE_BARS[0];

  return (
    <>
      <Select
        variant="outlined"
        margin="dense"
        value={languageChoose.code}
        onChange={handleChangeLanguage}
        style={{ width: 120 }}>
        {LANGUAGE_BARS.map((item) => (
          <MenuItem key={item.id} value={item.code}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default LanguageBar;

import { store } from "reducers";
import { ActionType } from "reducers/coreui";

export const DARKMODE = "hrm.admin.darkmode";
export const LANGUAGE = "hrm.admin.language";

const updateDarkmode = (darkmode) => {
  store.dispatch({
    type: ActionType.GET_DARKMODE,
    data: darkmode,
  });
  localStorage.setItem(DARKMODE, darkmode);
};

const updateLanguage = (language) => {
  store.dispatch({
    type: ActionType.GET_LANGUAGE,
    data: language,
  });
  localStorage.setItem(LANGUAGE, language);
};

export const coreuiAction = {
  ActionType,
  updateDarkmode,
  updateLanguage,
};

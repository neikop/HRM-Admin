import { store } from "reducers";
import { ActionType } from "reducers/coreui";

const updateDarkmode = (darkmode) => {
  store.dispatch({
    type: ActionType.GET_DARKMODE,
    data: darkmode,
  });
  localStorage.setItem("hrm.admin.darkmode", darkmode);
};

const updateLanguage = (language) => {
  store.dispatch({
    type: ActionType.GET_LANGUAGE,
    data: language,
  });
  localStorage.setItem("hrm.admin.language", language);
};

export const coreuiAction = {
  ActionType,
  updateDarkmode,
  updateLanguage,
};

import { store } from "reducers";
import { ActionType } from "reducers/profile";

const login = (profile) => {
  store.dispatch({
    type: ActionType.USER_LOGIN,
    data: profile,
  });
  localStorage.setItem("hrm.admin.user", JSON.stringify(profile));
};

const logout = () => {
  store.dispatch({
    type: ActionType.USER_LOGOUT,
  });
  localStorage.removeItem("hrm.admin.user");
};

export const profileAction = {
  ActionType,
  login,
  logout,
};

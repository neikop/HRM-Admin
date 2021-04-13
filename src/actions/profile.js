import { store } from "reducers";
import { ActionType } from "reducers/profile";

const login = (profile) => {
  store.dispatch({
    type: ActionType.USER_LOGIN,
    data: profile,
  });
};

const logout = () => {
  store.dispatch({
    type: ActionType.USER_LOGOUT,
  });
};

export const profileAction = {
  ActionType,
  login,
  logout,
};

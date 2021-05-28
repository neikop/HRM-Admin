import { store } from "reducers";
import { ActionType } from "reducers/profile";
import { USER_ROLES, USER_TYPES } from "utils/constants";

const login = (profile) => {
  const { roleId, userType } = profile;
  Object.assign(profile, {
    isSuper: roleId === USER_ROLES[0].code,
    isAdmin: roleId === USER_ROLES[1].code,
    isUser: roleId === USER_ROLES[2].code,
    isRecruit: userType === USER_TYPES[0].code,
    isCompany: userType === USER_TYPES[1].code,
  });
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

const update = (user) => {
  store.dispatch({
    type: ActionType.USER_UPDATE,
    data: user,
  });
};

export const profileAction = {
  ActionType,
  login,
  logout,
  update,
};

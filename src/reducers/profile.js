export const ActionType = {
  USER_LOGIN: "USER_LOGIN",
  USER_LOGOUT: "USER_LOGOUT",
  USER_UPDATE: "USER_UPDATE",
};

const profile = (state = {}, { type, data }) => {
  switch (type) {
    case ActionType.USER_LOGIN:
      return { ...data };
    case ActionType.USER_LOGOUT:
      return {};
    case ActionType.USER_UPDATE:
      return { ...state, ...data };
    default:
      return { ...state };
  }
};

export default profile;

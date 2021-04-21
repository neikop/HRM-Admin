export const ActionType = {
  GET_DARKMODE: "GET_DARKMODE",
  GET_LANGUAGE: "GET_LANGUAGE",
};

const coreui = (
  state = {
    language: null,
    darkmode: null,
  },
  { type, data },
) => {
  switch (type) {
    case ActionType.GET_DARKMODE:
      return { ...state, darkmode: data };
    case ActionType.GET_LANGUAGE:
      return { ...state, language: data };
    default:
      return { ...state };
  }
};

export default coreui;

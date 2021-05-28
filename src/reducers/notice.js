export const ActionType = {
  UPDATE_NOTICE: "UPDATE_NOTICE",
  REMOVE_NOTICE: "REMOVE_NOTICE",
};

const initState = { update: {}, remove: {} };

const noticeList = (state = initState, { type, data }) => {
  const { update, remove } = state;
  switch (type) {
    case ActionType.UPDATE_NOTICE:
      return { update: data, remove };
    case ActionType.REMOVE_NOTICE:
      return { update, remove: data };
    default:
      return state;
  }
};

export default noticeList;

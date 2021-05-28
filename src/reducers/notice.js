export const ActionType = {
  NOTICE_APPEND_LIST: "NOTICE_APPEND_LIST",
  NOTICE_RESET_LIST: "NOTICE_RESET_LIST",
  NOTICE_UPDATE_ONE: "NOTICE_UPDATE_ONE",
  NOTICE_DELETE_ONE: "NOTICE_DELETE_ONE",
  NOTICE_UPDATE_NUMBER: "NOTICE_UPDATE_NUMBER",
};

const initState = { dataList: [], nextPage: 0, isLast: false, number: 0 };

const noticeList = (state = initState, { type, data }) => {
  const { dataList: list, nextPage: page } = state;
  switch (type) {
    case ActionType.NOTICE_APPEND_LIST:
      return {
        ...state,
        dataList: list.concat(data),
        nextPage: page + 1,
        isLast: data.length === 0,
      };
    case ActionType.NOTICE_RESET_LIST:
      return initState;
    case ActionType.NOTICE_UPDATE_ONE:
      return {
        ...state,
        dataList: list.map((item) => ({ ...item, ...(item.id === data.id ? data : {}) })),
      };
    case ActionType.NOTICE_DELETE_ONE:
      return {
        ...state,
        dataList: list.filter((item) => item.id !== data.id),
      };
    case ActionType.NOTICE_UPDATE_NUMBER:
      return {
        ...state,
        number: data,
      };
    default:
      return state;
  }
};

export default noticeList;

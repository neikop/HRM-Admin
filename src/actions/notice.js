import { store } from "reducers";
import { ActionType } from "reducers/notice";

const noticeAppendList = (data) => {
  store.dispatch({
    type: ActionType.NOTICE_APPEND_LIST,
    data,
  });
};

const noticeResetList = (data) => {
  store.dispatch({
    type: ActionType.NOTICE_RESET_LIST,
    data,
  });
};

const noticeUpdateOne = (data) => {
  store.dispatch({
    type: ActionType.NOTICE_UPDATE_ONE,
    data,
  });
};

const noticeDeleteOne = (data) => {
  store.dispatch({
    type: ActionType.NOTICE_DELETE_ONE,
    data,
  });
};

const noticeUpdateNumber = (data) => {
  store.dispatch({
    type: ActionType.NOTICE_UPDATE_NUMBER,
    data,
  });
};

export const noticeAction = {
  ActionType,
  noticeAppendList,
  noticeResetList,
  noticeUpdateOne,
  noticeDeleteOne,
  noticeUpdateNumber,
};

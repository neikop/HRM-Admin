import { store } from "reducers";
import { ActionType } from "reducers/notice";

const updateNotice = (data) => {
  store.dispatch({
    type: ActionType.UPDATE_NOTICE,
    data,
  });
};

const removeNotice = (data) => {
  store.dispatch({
    type: ActionType.REMOVE_NOTICE,
    data,
  });
};

export const noticeAction = {
  ActionType,
  updateNotice,
  removeNotice,
};

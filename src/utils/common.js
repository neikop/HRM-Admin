import { Translation } from "react-i18next";
import { store } from "reducers";

export const t = (message) => <Translation>{(t) => t(message)}</Translation>;

export const getCurrentToken = () => {
  const { profile } = store.getState();
  return profile.token;
};

export const getUnix = (moment) => (moment && moment.isValid() ? moment.unix() * 1000 : null);

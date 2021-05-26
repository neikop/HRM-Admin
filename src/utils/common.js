import { Translation } from "react-i18next";
import { store } from "reducers";
import { LANGUAGE } from "actions/coreui";
import moment from "moment";
import "moment/locale/vi";

export const HHMM_DDMMYYYY = "HH:mm DD/MM/YYYY";

export const t = (message) => <Translation>{(t) => t(message)}</Translation>;

export const getCurrentToken = () => {
  const { profile } = store.getState();
  return profile.token;
};

export const getUnix = (moment) => (moment && moment.isValid() ? moment.unix() : null);

export const convertTime = (millis) => moment(millis).locale(localStorage.getItem(LANGUAGE)).fromNow();

export const getDate = (millis) => moment(millis).format(HHMM_DDMMYYYY);

import { store } from "reducers";

export const getCurrentUser = () => {
  const { profile } = store.getState();
  return profile;
};

export const getCurrentToken = () => {
  const { profile } = store.getState();
  return profile.token;
};

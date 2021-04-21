import { createStore, combineReducers } from "redux";
import profile from "./profile";
import coreui from "./coreui";

export const store = createStore(
  combineReducers({
    profile,
    coreui,
  }),
  {},
);

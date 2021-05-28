import { createStore, combineReducers } from "redux";
import profile from "./profile";
import coreui from "./coreui";
import notice from "./notice";

export const store = createStore(
  combineReducers({
    profile,
    coreui,
    notice,
  }),
  {},
);

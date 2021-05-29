import { client } from "./axios";

const api = "/api/v1/user";

const login = (body) => send(`${api}/login`, body);
const signup = (body) => send(`${api}/signup`, body);

const send = (url, body) => {
  const form = new FormData();
  Object.keys(body).forEach((key) => {
    const value = typeof body[key] === "string" ? body[key].trim() : body[key];
    form.append(key, value);
  });
  return client.post(url, form);
};

const getListUser = (body) => client.post(api, { constructor: "getListUser", ...body });
const getUserInfo = (body) => client.post(api, { constructor: "getUserInfo", ...body });
const updateUserInfo = (body) => client.post(api, { constructor: "updateUserInfo", ...body });
const changePassword = (body) => client.post(api, { constructor: "changePassword", ...body });
const updateRole = (body) => client.post(api, { constructor: "updateRole", ...body });
const deleteUser = (body) => client.post(api, { constructor: "deleteUser", ...body });

export const userService = {
  login,
  signup,

  getListUser,
  getUserInfo,
  updateUserInfo,
  changePassword,
  updateRole,
  deleteUser,
};

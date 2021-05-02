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

export const userService = {
  login,
  signup,
};

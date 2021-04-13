import { client } from "./axios";

const api = "/api/v1/user";

const login = (body) => {
  const form = new FormData();
  Object.keys(body).forEach((key) => {
    form.append(key, body[key]);
  });
  return client.post(`${api}/login`, form);
};

export const userService = {
  login,
};

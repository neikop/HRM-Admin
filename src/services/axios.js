import { Alert } from "components";
import { profileAction } from "actions/profile";
import { getCurrentToken } from "utils/common";
import axios from "axios";
import env from "env";

const onError = ({ response }) => {
  if (response) {
    const { data, status, statusText } = response;
    if (status === 401) {
      profileAction.logout();
    } else {
      const { message } = data;
      Alert.error({ message: message ?? `${status} - ${statusText}` });
    }
  } else {
    Alert.error({ message: `Cannot connect to Server` });
  }
  return Promise.reject(response);
};

const beforeRequest = (config) => {
  Object.assign(config.headers, { Authorization: getCurrentToken() });
  if (config.data instanceof FormData) {
    Object.assign(config.headers, { "Content-Type": "multipart/form-data" });
  }
  return config;
};

const client = axios.create({ baseURL: env.API_URL, timeout: 10000 });
const clientFile = axios.create({ baseURL: env.API_FILE_URL, timeout: 10000 });

[client, clientFile].forEach((client) => {
  client.interceptors.response.use(({ data }) => data, onError);
  client.interceptors.request.use(beforeRequest);
});

export { client, clientFile };

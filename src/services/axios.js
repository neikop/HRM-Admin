import { Alert } from "components";
import { getCurrentToken } from "utils/common";
import axios from "axios";
import env from "env";

const onError = ({ response }) => {
  if (response) {
    const { data, status, statusText } = response;
    const { message = `${status} - ${statusText}` } = data;
    Alert.error({ message });
  } else {
    Alert.error({ message: `Cannot connect to Server` });
  }
  return Promise.reject(response);
};

const client = axios.create({ baseURL: env.API_URL });
client.interceptors.response.use(({ data }) => data, onError);
client.interceptors.request.use((config) => {
  Object.assign(config.headers, { Authorization: getCurrentToken() });
  if (config.data instanceof FormData) {
    Object.assign(config.headers, { "Content-Type": "multipart/form-data" });
  }
  return config;
});

export { client };

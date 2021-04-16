import { client } from "./axios";

const api = `http://103.137.4.104:9696/api/v1/job`;

const getListInfoJob = (body) => client.post(api, { constructor: "getListInfoJob", ...body });
const getInfoJob = (body) => client.post(api, { constructor: "getInfoJob", ...body });

export const jobService = {
  getListInfoJob,
  getInfoJob,
};

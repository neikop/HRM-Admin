import { client } from "./axios";

const api = `http://103.137.4.104:9696/api/v1/job`;

const getListInfoJob = (body) =>
  client.post(api, {
    constructor: "getListInfoJob",
    params_request: { limit: 10 },
    search: { ...body },
  });

export const jobService = {
  getListInfoJob,
};

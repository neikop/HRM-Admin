import { client } from "./axios";

const api = `http://103.137.4.104:9696/api/v1/job`;

const getListInfoJob = (body) => client.post(api, { constructor: "getListInfoJob", ...body });
const getInfoJob = (body) => client.post(api, { constructor: "getInfoJob", ...body });

const applyCvToJob = (body) => client.post(api, { constructor: "applyCvToJob", ...body });

const createJob = (body) => client.post(api, { constructor: "createJob", ...body });
const deleteJob = (body) => client.post(api, { constructor: "deleteJob", ...body });
const updateJob = (body) => client.post(api, { constructor: "updateJob", ...body });

export const jobService = {
  getListInfoJob,
  getInfoJob,

  applyCvToJob,

  createJob,
  deleteJob,
  updateJob,
};

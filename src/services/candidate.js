import { client } from "./axios";

const api = `http://103.137.4.104:9696/api/v1/cv`;

const getListInfoCv = (body) => client.post(api, { constructor: "getListInfoCv", ...body });
const getInfoCv = (body) => client.post(api, { constructor: "getInfoCv", ...body });

export const candidateService = {
  getListInfoCv,
  getInfoCv,
};

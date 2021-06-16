import { client } from "./axios";

const api = "/api/v1/company";

const getListInfoCompany = (body) => client.post(api, { constructor: "getListInfoCompany", ...body });
const getInfoCompany = (body) => client.post(api, { constructor: "getInfoCompany", ...body });

const createCompany = (body) => client.post(api, { constructor: "createCompany", ...body });
const updateCompany = (body) => client.post(api, { constructor: "updateCompany", ...body });
const deleteCompany = (body) => client.post(api, { constructor: "deleteCompany", ...body });

export const companyService = {
  getListInfoCompany,
  getInfoCompany,

  createCompany,
  updateCompany,
  deleteCompany,
};

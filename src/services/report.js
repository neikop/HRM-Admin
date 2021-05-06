import { client } from "./axios";

const api = "/api/v1/report";

const getDashboard = (body) => client.get(`${api}/dashboard`, { params: { ...body } });

export const reportService = {
  getDashboard,
};

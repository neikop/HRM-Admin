import { client, clientFile } from "./axios";

const resumeParser = (form) => clientFile.post(`/predictions/resume-parser`, form);
const uploadFile = (form) => client.post(`/api/v1/resource/storage/upload`, form);

export const fileService = {
  resumeParser,
  uploadFile,
};

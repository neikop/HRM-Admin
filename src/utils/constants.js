import { t } from "utils/common";

export const WORKPLACE_TYPES = [
  { id: 1, code: "Hà Nội", name: t("Ha Noi") },
  { id: 2, code: "Đà Nẵng", name: t("Da Nang") },
  { id: 3, code: "Hồ Chí Minh", name: t("Ho Chi Minh") },
];

export const CURRENCY_TYPES = [
  { id: 1, code: "VND", name: "VND" },
  { id: 2, code: "USD", name: "USD" },
  { id: 3, code: "JPY", name: "JPY" },
];

export const JOB_STATUS_TYPES = [
  { id: 1, code: 1, name: t("Active") },
  { id: 2, code: 0, name: t("Close") },
];

export const JOB_FORMS = [
  { id: 1, code: "Full Time", name: "Full Time" },
  { id: 2, code: "Part Time", name: "Part Time" },
];

export const CANDIDATE_LEVELS = [
  { id: 1, code: "Fresher", name: t("Fresher") },
  { id: 2, code: "Junior", name: t("Junior") },
  { id: 3, code: "Senior", name: t("Senior") },
];

export const DDMMYYYY = "DD/MM/YYYY";
export const DDMMYYYY_HHMM = "DD/MM/YYYY HH:mm";

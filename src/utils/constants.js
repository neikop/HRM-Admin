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
  { id: 1, code: 2, name: t("Open"), color: "green" },
  { id: 2, code: 1, name: t("Processing"), color: "blue" },
  { id: 3, code: 3, name: t("Urgent"), color: "volcano" },
  { id: 4, code: -1, name: t("Close") },
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

export const CANDIDATE_STATUS_TYPES = [
  { id: 1, code: 0, name: t("Open") },
  { id: 2, code: 1, name: t("Close") },
];

export const REFERRAL_STATUS_TYPES = [
  { id: 1, code: 0, name: t("Approve Pending") },
  { id: 2, code: 1, name: t("CV Passed") },
  { id: 3, code: -1, name: t("CV Rejected") },
  { id: 4, code: 2, name: t("Interview Waiting") },
  { id: 5, code: 3, name: t("Interview Passed") },
  { id: 6, code: -3, name: t("Interview Failed") },
  { id: 7, code: 4, name: t("Offer Accepted") },
  { id: 8, code: -4, name: t("Offer Rejected") },
  { id: 9, code: 5, name: t("Probation Passed") },
  { id: 10, code: -5, name: t("Probation Failed") },
];

export const USER_ROLES = [
  { id: 1, code: 1000, name: t("Super Admin") },
  { id: 2, code: 1005, name: t("Admin") },
  { id: 3, code: 1010, name: t("User") },
];

export const USER_TYPES = [
  { id: 1, code: 0, name: t("Recruiter") },
  { id: 2, code: 1, name: t("Employer") },
];

export const DDMMYYYY = "DD/MM/YYYY";
export const DDMMYYYY_HHMM = "DD/MM/YYYY HH:mm";

import { t } from "utils/common";
import { skills } from "utils/skills";

export const WORKPLACE_TYPES = [
  { id: 1, code: "Hà Nội", name: t("Hà Nội") },
  { id: 2, code: "Đà Nẵng", name: t("Đà Nẵng") },
  { id: 3, code: "Hồ Chí Minh", name: t("Hồ Chí Minh") },
  { id: 4, code: "日本", name: t("日本") },
];

export const CURRENCY_TYPES = [
  { id: 1, code: "VND", name: "VND" },
  { id: 2, code: "USD", name: "USD" },
  { id: 3, code: "JPY", name: "JPY" },
];

export const JOB_STATUS_TYPES = [
  { id: 1, code: 2, name: t("Open"), color: "green" },
  { id: 2, code: 1, name: t("Processing"), color: "blue", noRecruit: 1 },
  { id: 3, code: 3, name: t("Urgent"), color: "volcano" },
  { id: 4, code: -1, name: t("Close"), noRecruit: 1 },
];

export const JOB_FORMS = [
  { id: 1, code: "Full Time", name: "Full Time" },
  { id: 2, code: "Part Time", name: "Part Time" },
];

export const JOB_COUNTRIES = [
  { id: 1, code: "vietnam", name: "Việt Nam" },
  { id: 2, code: "japan", name: "Japan" },
];

export const CANDIDATE_LEVELS = [
  { id: 1, code: "Fresher (Dưới 1 năm kinh nghiệm)", name: t("Fresher (Dưới 1 năm kinh nghiệm)") },
  { id: 2, code: "Junior (Từ 1 đến 3 năm kinh nghiệm)", name: t("Junior (Từ 1 đến 3 năm kinh nghiệm)") },
  { id: 3, code: "Senior (Trên 3 năm kinh nghiệm)", name: t("Senior (Trên 3 năm kinh nghiệm)") },
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

export const SKILLS = skills;


export const BANK_INFO = [
  { id: 1, code: "vpbank", name: "VPBank" },
  { id: 2, code: "techcombank", name: "Techcombank - NH Ky Thuong" },
  { id: 3, code: "vietcombank", name: "Vietcombank - NH Ngoai Thuong" },
  { id: 4, code: "viettinbank", name: "Viettinbank - NH Cong Thuong Viet Nam" },
  { id: 5, code: "bidv", name: "BIDV - NH Dau Tu Va Phat Trien Viet Nam" },
  { id: 6, code: "agribank", name: "Agribank - NH Nong Nghiep va PTNT VN" },
  { id: 7, code: "mbbank", name: "Mbbank - NH Quan Doi" },
  { id: 8, code: "acb", name: "ACB - NH A Chau" },
  { id: 9, code: "hdbank", name: "NH Phat Trien TP HCM" },
  { id: 10, code: "tpbank", name: "TPBANK - NH Tien Phong" },
  { id: 11, code: "sacombank", name: "SACOMBANK - NH Sai Gon Thuong Tin" },
];







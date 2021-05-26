import { browserHistory } from "utils/history";
import { privateRoute } from "routes";
import { client } from "./axios";
import { getDate } from "utils/common";

const api = "/api/v1/notice";

const getListNotificationByUser = (body) => client.post(api, { constructor: "getListNotificationByUser", ...body });
const updateNotification = (body) => client.post(api, { constructor: "updateNotification", ...body });
const removeNotification = (body) => client.post(api, { constructor: "updateNotification", ...body });

export const noticeService = {
  getListNotificationByUser,
  updateNotification,
  removeNotification,
};

export const noticeFormat = (item) => {
  const user = item.userCreate?.username;
  const candidate = item.resume?.candidateName;
  const reminder = getDate(item.resume?.calendarReminder * 1000);
  const job = item.job?.title;
  switch (item.type) {
    case 1:
      return (
        <>
          Job <b>{job}</b> đã có ứng viên <b>{candidate}</b> ứng tuyển.
        </>
      );
    case 2:
      return (
        <>
          Trạng thái của ứng viên <b>{candidate}</b> ứng tuyển vào Job <b>{job}</b> đã được cập nhật.
        </>
      );
    case 3:
      return (
        <>
          Ứng viên <b>{candidate}</b> của bạn có lịch nhắc nhở vào <b>{reminder}</b>.
        </>
      );
    case 5:
      return (
        <>
          User <b>{user}</b> vừa ứng tuyển ứng viên <b>{candidate}</b> vào Job <b>{job}</b> đang chờ phê duyệt.
        </>
      );
    case 7:
      return (
        <>
          Trạng thái của ứng viên <b>{candidate}</b> đã được cập nhật.
        </>
      );
    default:
      return <>Bạn có thông báo mới</>;
  }
};

export const noticeRouter = (item) => {
  if (item.type === 1) browserHistory.push(privateRoute.jobView.url(item.job?.idJob, "referral"));
  if (item.type === 2) browserHistory.push(privateRoute.referList.path);
  if (item.type === 3) browserHistory.push(privateRoute.candidateUpdate.url(item.resume?.id));
  if (item.type === 5) browserHistory.push(privateRoute.referList.path);
  if (item.type === 7) browserHistory.push(privateRoute.candidateUpdate.url(item.resume?.id));
};

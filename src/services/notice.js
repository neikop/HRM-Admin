import { browserHistory } from "utils/history";
import { privateRoute } from "routes";
import { client } from "./axios";

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
  const candidate = item.resume?.candidateName;
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
          Trạng thái của ứng viên <b>{candidate}</b> ứng viên vào Job <b>{job}</b> đã được cập nhật.
        </>
      );
    case 7:
      return (
        <>
          Trạng thái của ứng viên <b>{candidate}</b> đã được cập nhật.
        </>
      );
    default:
      return <>Bạn có tin nhắn mới</>;
  }
};

export const noticeRouter = (item) => {
  if (item.type === 1) browserHistory.push(privateRoute.jobView.url(item.job?.idJob, "referral"));
  if (item.type === 2) browserHistory.push(privateRoute.referList.path);
  if (item.type === 7) browserHistory.push(privateRoute.candidateUpdate.url(item.resume?.id));
};

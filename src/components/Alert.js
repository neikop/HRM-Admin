import { Spin, notification } from "antd";
import { CircularProgress } from "@material-ui/core";

Spin.setDefaultIndicator(<CircularProgress />);

notification.config({
  placement: "bottomRight",
});

export default notification;

import React from "react";
import { Link } from "react-router-dom";
import { Loading, PerfectScrollbar } from "components";
import { Avatar, IconButton, ListItemAvatar, Paper } from "@material-ui/core";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Dropdown } from "antd";
import { noticeService, noticeFormat, noticeRouter } from "services/notice";
import { convertTime, t } from "utils/common";
import { privateRoute } from "routes";

import NotificationsActiveOutlinedIcon from "@material-ui/icons/NotificationsActiveOutlined";

const NotificationPopup = () => {
  const classes = useStyles();

  const [, setCounter] = React.useState(0);
  const [dataList, setDataList] = React.useState([]);
  const [dataLoading, setDataLoading] = React.useState(false);

  const isLast = React.useRef(false);
  const isStop = React.useRef(false);
  const offet = React.useRef(0);

  const fetchData = React.useCallback(() => {
    if (isLast.current || isStop.current) return;

    setDataLoading(true);
    isStop.current = true;
    noticeService
      .getListNotificationByUser({
        params_request: { page: offet.current, size: 10 },
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { notifications } = data;
          setDataList((items) => items.concat(notifications));
          if (notifications.length === 0) isLast.current = true;
          offet.current = offet.current + 1;
        }
      })
      .catch(console.warn)
      .finally(() => {
        setDataLoading(false);
        isStop.current = false;
      });
  }, []);

  const handleClickRead = (item) => {
    noticeRouter(item);
    if (item.status === 0)
      noticeService
        .updateNotification({
          params_request: { id: item.id, status: 1 },
        })
        .then(() => {
          Object.assign(item, { status: 1 });
          setCounter((i) => i + 1);
        })
        .catch(console.warn);
  };

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Dropdown
      trigger="click"
      placement="bottomRight"
      getPopupContainer={(event) => event.parentNode}
      overlay={
        <div>
          <List component={Paper} disablePadding className={classes.listContainer}>
            <PerfectScrollbar onYReachEnd={fetchData}>
              {dataList.map((item, index) => (
                <ListItem
                  key={index}
                  dense
                  button
                  divider
                  selected={item.status === 0}
                  className={classes.listItem}
                  onClick={() => handleClickRead(item)}>
                  <ListItemAvatar>
                    <Avatar src={item.job?.avatar} style={{ backgroundColor: "transparent" }}>
                      <Avatar src="/kai_avatar.png" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={noticeFormat(item)} secondary={convertTime(item.createTime * 1000)} />
                </ListItem>
              ))}

              {!isLast.current && (
                <ListItem className="flex-center">
                  <Loading visible={dataLoading} />
                </ListItem>
              )}
            </PerfectScrollbar>

            <ListItem
              dense
              button
              component={Link}
              className={classes.listBottom}
              to={privateRoute.notificationList.path}>
              <ListItemText primary={t("View all")} style={{ textAlign: "center" }} />
            </ListItem>
            <ListItem dense divider className={classes.listTop}>
              <ListItemText primary={t("Notifications")} primaryTypographyProps={{ variant: "subtitle1" }} />
            </ListItem>
          </List>
        </div>
      }>
      <IconButton>
        <NotificationsActiveOutlinedIcon />
      </IconButton>
    </Dropdown>
  );
};

const useStyles = makeStyles((theme) => ({
  listContainer: {
    marginTop: 6,
    width: 360,
    height: 360,
    paddingTop: 36,
    paddingBottom: 36,
  },
  listItem: {
    "&:hover": {
      backgroundColor: "#0002 !important",
    },
  },
  listTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "#fff",
  },
  listBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTop: "1px solid rgba(0, 0, 0, 0.1)",
  },
}));

export default NotificationPopup;

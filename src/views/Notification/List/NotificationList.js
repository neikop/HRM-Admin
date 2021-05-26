import React from "react";
import { Loading } from "components";
import { Avatar, IconButton, ListItemAvatar, Paper, Typography } from "@material-ui/core";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { noticeService, noticeFormat, noticeRouter } from "services/notice";
import { convertTime, t } from "utils/common";

import NotificationsActiveOutlinedIcon from "@material-ui/icons/NotificationsActiveOutlined";

const NotificationList = () => {
  const classes = useStyles();

  const [, setCounter] = React.useState(0);
  const [dataList, setDataList] = React.useState([]);
  const [dataLoading, setDataLoading] = React.useState(false);

  const isLast = React.useRef(false);
  const isStop = React.useRef(false);
  const offet = React.useRef(0);

  const fetchData = React.useCallback(() => {
    if (isLast.current || isStop.current) return;

    const { scrollHeight } = document.getElementById("NotificationList");
    if (window.innerHeight + window.scrollY + 120 < scrollHeight) return;

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
          params_request: {
            id: item.id,
            status: 1,
            type: item.type,
            idJob: item.job?.idJob,
            idCv: item.resume?.id,
          },
        })
        .then(() => {
          Object.assign(item, { status: 1 });
          setCounter((i) => i + 1);
        })
        .catch(console.warn);
  };

  React.useEffect(() => {
    fetchData();
    window.addEventListener("scroll", fetchData);
    return () => window.removeEventListener("scroll", fetchData);
  }, [fetchData]);

  return (
    <>
      <Paper elevation={0} className="align-items-center mb-24" style={{ backgroundColor: "transparent" }}>
        <IconButton>
          <NotificationsActiveOutlinedIcon />
        </IconButton>
        <Typography variant="h6" className="flex-1">
          {t("Notifications")}
        </Typography>
      </Paper>

      <Paper className="mb-24" id="NotificationList">
        <List disablePadding>
          <ListItem divider></ListItem>
          {dataList.map((item, index) => (
            <ListItem
              key={index}
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
          {dataList.length === 0 && isLast.current && (
            <ListItem divider>
              <ListItemText primary={t("You don't have any notifications")} />
            </ListItem>
          )}
          <ListItem className="flex-center">
            <Loading visible={dataLoading} />
          </ListItem>
        </List>
      </Paper>
      {offet.current <= 1 && <div style={{ height: "40vh" }} />}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  listItem: {
    "&:hover": {
      backgroundColor: "#0002 !important",
    },
  },
}));

export default NotificationList;

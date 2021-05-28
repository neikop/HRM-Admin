import React from "react";
import { Loading } from "components";
import { Avatar, IconButton, ListItemAvatar, Paper, Tooltip, Typography } from "@material-ui/core";
import { List, ListItem, ListItemText, ListItemSecondaryAction } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { noticeAction } from "actions/notice";
import { noticeService, noticeFormat, noticeRouter } from "services/notice";
import { convertTime, t } from "utils/common";
import { useNotice } from "./useNotice";

import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import NotificationsActiveOutlinedIcon from "@material-ui/icons/NotificationsActiveOutlined";

const NotificationList = () => {
  const classes = useStyles();

  const [dataList, setDataList] = useNotice();
  const [dataLoading, setDataLoading] = React.useState(false);

  const isLast = React.useRef(false);
  const isStop = React.useRef(false);
  const offset = React.useRef(0);

  const fetchData = React.useCallback(() => {
    if (isLast.current || isStop.current) return;

    setDataLoading(true);
    isStop.current = true;
    noticeService
      .getListNotificationByUser({
        params_request: { page: offset.current, size: 10 },
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { notifications } = data;
          setDataList((items) => items.concat(notifications));
          if (notifications.length === 0) isLast.current = true;
          offset.current = offset.current + 1;
        }
      })
      .catch(console.warn)
      .finally(() => {
        setDataLoading(false);
        isStop.current = false;
      });
  }, [setDataList]);

  const handleClickRead = (item) => {
    noticeAction.updateNotice({ ...item, status: 1 });
    if (item.status === 0) {
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
        .catch(console.warn);
    }
  };

  const handleClickDelete = (item) => {
    noticeAction.removeNotice(item);
    noticeService
      .removeNotification({
        params_request: {
          ids: [item.id],
        },
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
              onClick={() => {
                handleClickRead(item);
                noticeRouter(item);
              }}>
              <ListItemAvatar>
                <Avatar src={item.job?.avatar} style={{ backgroundColor: "transparent" }}>
                  <Avatar src="/kai_avatar.png" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={noticeFormat(item)} secondary={convertTime(item.createTime * 1000)} />
              {item.isSystem === 0 && (
                <ListItemSecondaryAction>
                  <Tooltip title={t("Remove")}>
                    <IconButton edge="end" onClick={() => handleClickDelete(item)}>
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              )}
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
      {offset.current <= 1 && <div style={{ height: "40vh" }} />}
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

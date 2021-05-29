import React from "react";
import { Loading } from "components";
import { Avatar, IconButton, ListItemAvatar, Paper, Typography } from "@material-ui/core";
import { Menu, List, ListItem, ListItemText, ListItemSecondaryAction } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { noticeAction } from "actions/notice";
import { noticeService, noticeFormat, noticeRouter } from "services/notice";
import { convertTime, t } from "utils/common";
import { useNotice } from "./useNotice";

import NotificationsActiveOutlinedIcon from "@material-ui/icons/NotificationsActiveOutlined";
import AccessTimeOutlinedIcon from "@material-ui/icons/AccessTimeOutlined";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import RadioButtonCheckedOutlinedIcon from "@material-ui/icons/RadioButtonCheckedOutlined";
import RadioButtonUncheckedOutlinedIcon from "@material-ui/icons/RadioButtonUncheckedOutlined";

const NotificationList = () => {
  const classes = useStyles();

  const [dataList, setDataList] = useNotice();
  const [dataLoading, setDataLoading] = React.useState(false);

  const isLast = React.useRef(false);
  const isStop = React.useRef(false);
  const offset = React.useRef(0);

  const [chosenItem, setChosenItem] = React.useState({});
  const [anchorItem, setAnchorItem] = React.useState(null);
  const handleClickItem = (item) => (event) => {
    setChosenItem(item);
    setAnchorItem(event.currentTarget);
  };
  const handleCloseItem = () => {
    setAnchorItem(null);
  };

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

  const handleClickRead = (item, status) => {
    if (item.isSystem) return;
    noticeAction.updateNotice({ ...item, status });
    noticeService
      .updateNotification({
        params_request: {
          id: item.id,
          status,
          type: item.type,
          idJob: item.job?.idJob,
          idCv: item.resume?.id,
        },
      })
      .catch(console.warn);
  };

  const handleClickDelete = (item) => {
    if (item.isSystem) return;
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
                noticeRouter(item);
                handleClickRead(item, 1);
              }}>
              <ListItemAvatar>
                <Avatar src={item.job?.avatar} style={{ backgroundColor: "transparent" }}>
                  <Avatar src="/kai_avatar.png" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={noticeFormat(item)}
                secondary={
                  <div className="align-items-center">
                    <AccessTimeOutlinedIcon fontSize="small" className="mr-4" />
                    {convertTime(item.createTime * 1000)}
                  </div>
                }
              />
              {item.isSystem === 0 && (
                <ListItemSecondaryAction>
                  <IconButton edge="end" size="small" onClick={handleClickItem(item)}>
                    <MoreHorizOutlinedIcon fontSize="small" />
                  </IconButton>
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

        <Menu anchorEl={anchorItem} open={Boolean(anchorItem)} onClose={handleCloseItem}>
          {chosenItem.status === 0 && (
            <ListItem
              button
              dense
              onClick={() => {
                handleClickRead(chosenItem, 1);
                handleCloseItem();
              }}>
              <RadioButtonCheckedOutlinedIcon className="mr-8" />
              <ListItemText primary={t("Mark as read")} />
            </ListItem>
          )}
          {chosenItem.status === 1 && (
            <ListItem
              button
              dense
              onClick={() => {
                handleClickRead(chosenItem, 0);
                handleCloseItem();
              }}>
              <RadioButtonUncheckedOutlinedIcon className="mr-8" />
              <ListItemText primary={t("Mark as unread")} />
            </ListItem>
          )}
          <ListItem
            button
            dense
            onClick={() => {
              handleClickDelete(chosenItem);
              handleCloseItem();
            }}>
            <CancelOutlinedIcon className="mr-8" />
            <ListItemText primary={t("Remove notification")} />
          </ListItem>
        </Menu>
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

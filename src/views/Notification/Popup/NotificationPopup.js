import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Loading, PerfectScrollbar } from "components";
import { Avatar, IconButton, ListItemAvatar, Paper, Badge, Tooltip } from "@material-ui/core";
import { List, ListItem, ListItemText, ListItemSecondaryAction } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Dropdown } from "antd";
import { noticeAction } from "actions/notice";
import { noticeService, noticeFormat, noticeRouter } from "services/notice";
import { convertTime, t } from "utils/common";
import { privateRoute } from "routes";

import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import NotificationsActiveOutlinedIcon from "@material-ui/icons/NotificationsActiveOutlined";

const NotificationPopup = () => {
  const classes = useStyles();

  const { dataList, nextPage, isLast, number } = useSelector(({ notice }) => notice);
  const [dataLoading, setDataLoading] = React.useState(false);

  const fetchData = () => {
    if (isLast || dataLoading) return;

    setDataLoading(true);
    noticeService
      .getListNotificationByUser({
        params_request: { page: nextPage, size: 10 },
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { notifications, total } = data;
          noticeAction.noticeAppendList(notifications);
          noticeAction.noticeUpdateNumber(total);
        }
      })
      .catch(console.warn)
      .finally(() => {
        setDataLoading(false);
      });
  };

  const handleClickRead = (item) => {
    noticeRouter(item);
    noticeAction.noticeUpdateOne({ ...item, status: 1 });
    if (item.status === 0) {
      noticeAction.noticeUpdateNumber(number - 1);
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
    noticeAction.noticeDeleteOne(item);
    if (item.status === 0) {
      noticeAction.noticeUpdateNumber(number - 1);
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  {item.isSystem === 0 && (
                    <ListItemSecondaryAction>
                      <Tooltip title={t("Remove")}>
                        <IconButton edge="end" size="small" onClick={() => handleClickDelete(item)}>
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
              {dataList.length === 0 && isLast.current && (
                <ListItem>
                  <ListItemText primary={t("You don't have any notifications")} />
                </ListItem>
              )}
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
        <Badge badgeContent={Math.max(0, number)} color="error">
          <NotificationsActiveOutlinedIcon />
        </Badge>
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
    "@media (max-width: 600px)": {
      maxWidth: "75vw",
    },
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

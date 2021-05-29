import React from "react";
import { Link } from "react-router-dom";
import { Loading, PerfectScrollbar } from "components";
import { Avatar, IconButton, ListItemAvatar, Badge, Tooltip } from "@material-ui/core";
import { Menu, ListItem, ListItemText, ListItemSecondaryAction } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { noticeAction } from "actions/notice";
import { noticeService, noticeFormat, noticeRouter } from "services/notice";
import { convertTime, t } from "utils/common";
import { privateRoute } from "routes";
import { useNotice } from "../List/useNotice";

import NotificationsActiveOutlinedIcon from "@material-ui/icons/NotificationsActiveOutlined";
import AccessTimeOutlinedIcon from "@material-ui/icons/AccessTimeOutlined";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import RadioButtonCheckedOutlinedIcon from "@material-ui/icons/RadioButtonCheckedOutlined";
import RadioButtonUncheckedOutlinedIcon from "@material-ui/icons/RadioButtonUncheckedOutlined";

const NotificationPopup = () => {
  const classes = useStyles();

  const [dataList, setDataList, dataUnread, setDataUnread] = useNotice();
  const [dataLoading, setDataLoading] = React.useState(false);

  const isLast = React.useRef(false);
  const isStop = React.useRef(false);
  const offset = React.useRef(0);

  const [anchorMenu, setAnchorMenu] = React.useState(null);
  const handleClickMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

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
          const { notifications, total } = data;
          setDataList((items) => items.concat(notifications));
          setDataUnread(total);
          if (notifications.length === 0) isLast.current = true;
          offset.current = offset.current + 1;
        }
      })
      .catch(console.warn)
      .finally(() => {
        setDataLoading(false);
        isStop.current = false;
      });
  }, [setDataList, setDataUnread]);

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
  }, [fetchData]);

  return (
    <>
      <Tooltip title={t("Notifications")}>
        <IconButton onClick={handleClickMenu}>
          <Badge badgeContent={Math.max(0, dataUnread)} color="error">
            <NotificationsActiveOutlinedIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={handleCloseMenu}
        MenuListProps={{ disablePadding: true, className: classes.listContainer }}
        style={{ marginTop: 10 }}>
        <PerfectScrollbar onYReachEnd={fetchData}>
          {dataList.map((item, index) => (
            <ListItem
              key={index}
              dense
              button
              divider
              selected={item.status === 0}
              className={classes.listItem}
              onClick={() => {
                noticeRouter(item);
                handleClickRead(item, 1);
                handleCloseMenu();
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
          to={privateRoute.notificationList.path}
          onClick={() => {
            handleCloseMenu();
          }}>
          <ListItemText
            primary={t("View all")}
            primaryTypographyProps={{ color: "primary" }}
            style={{ textAlign: "center" }}
          />
        </ListItem>
        <ListItem dense divider className={classes.listTop}>
          <ListItemText primary={t("Notifications")} primaryTypographyProps={{ variant: "subtitle1" }} />
        </ListItem>
      </Menu>

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
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  listContainer: {
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

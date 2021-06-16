import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { t } from "utils/common";
import { privateRoute } from "routes";

import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WorkOutlineOutlinedIcon from "@material-ui/icons/WorkOutlineOutlined";
import LocationCityOutlinedIcon from "@material-ui/icons/LocationCityOutlined";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import DateRangeOutlinedIcon from "@material-ui/icons/DateRangeOutlined";

const Menu = ({ onClickMenu }) => {
  const { isSuper, isAdmin } = useSelector(({ profile }) => profile);
  const { home, jobList, companyList, candidateList, userList, referList } = privateRoute;

  const MenuItem = ({ visible = true, name, icon, path }) => {
    const classes = useStyles();
    const location = useLocation();
    return (
      visible && (
        <ListItem
          button
          component={Link}
          to={path}
          className={classes.item}
          selected={location.pathname.startsWith(path)}
          onClick={() => {
            if (onClickMenu) onClickMenu();
          }}>
          <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
          <ListItemText className={classes.text} primary={name} />
        </ListItem>
      )
    );
  };

  return (
    <>
      <MenuItem {...home} name={t("Home")} icon={<DashboardOutlinedIcon />} />
      <MenuItem {...jobList} name={t("Job")} icon={<WorkOutlineOutlinedIcon />} />
      <MenuItem {...companyList} name={t("Company")} icon={<LocationCityOutlinedIcon />} visible={isSuper || isAdmin} />
      <MenuItem {...candidateList} name={t("Candidate")} icon={<AssignmentIndOutlinedIcon />} />
      <MenuItem {...referList} name={t("Refer history")} icon={<DateRangeOutlinedIcon />} />
      <MenuItem {...userList} name={t("User")} icon={<GroupOutlinedIcon />} visible={isSuper || isAdmin} />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  item: {
    width: "unset",
    marginRight: 4,
    borderRadius: 4,
    "&:hover": {
      color: "#000",
      backgroundColor: "#0001",
    },
  },
  icon: {
    minWidth: "unset",
    marginRight: theme.spacing(1),
  },
}));

export default Menu;

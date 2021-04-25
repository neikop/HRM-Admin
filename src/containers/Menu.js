import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { t } from "utils/common";
import { privateRoute } from "routes";

import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WorkOutlineOutlinedIcon from "@material-ui/icons/WorkOutlineOutlined";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";

const MenuItem = ({ name, icon, path }) => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <ListItem button component={Link} to={path} className={classes.item} selected={location.pathname.startsWith(path)}>
      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
      <ListItemText primary={name} />
    </ListItem>
  );
};

const Menu = () => {
  return (
    <>
      <MenuItem {...privateRoute.home} name={t("Home")} icon={<DashboardOutlinedIcon />} />
      <MenuItem {...privateRoute.jobList} name={t("Job")} icon={<WorkOutlineOutlinedIcon />} />
      <MenuItem {...privateRoute.candidateList} name={t("Candidate")} icon={<AssignmentIndOutlinedIcon />} />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  item: {
    width: "unset",
  },
  icon: {
    minWidth: "unset",
    marginRight: theme.spacing(1),
  },
}));

export default Menu;

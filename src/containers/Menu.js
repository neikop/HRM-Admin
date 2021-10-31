import React from "react";
import { useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Hidden, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@material-ui/core";
import { Dropdown } from "antd";
import { makeStyles } from "@material-ui/core/styles";
import { t } from "utils/common";
import { JOB_COUNTRIES } from "utils/constants";
import { USER_TABS } from "utils/constants";
import { privateRoute } from "routes";
import { stringify, parse } from "query-string";

import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WorkOutlineOutlinedIcon from "@material-ui/icons/WorkOutlineOutlined";
import LocationCityOutlinedIcon from "@material-ui/icons/LocationCityOutlined";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import DateRangeOutlinedIcon from "@material-ui/icons/DateRangeOutlined";

const Menu = ({ onClickMenu }) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const { country, type } = parse(location.search);
  const { isSuper, isAdmin, isCompany } = useSelector(({ profile }) => profile);
  const { home, jobList, companyList, candidateList, userList, referList } = privateRoute;

  const MenuItem = ({ visible = true, name, icon, path }) => {
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

      <Hidden mdUp>
        <MenuItem {...jobList} name={t("Job")} icon={<WorkOutlineOutlinedIcon />} />
      </Hidden>

      <Hidden smDown>
        <Dropdown
          placement="bottomLeft"
          getPopupContainer={(event) => event.parentNode}
          overlay={
            <div>
              <List disablePadding component={Paper}>
                {JOB_COUNTRIES.map((item) => (
                  <ListItem
                    key={item.id}
                    button
                    selected={item.code === country}
                    onClick={() => {
                      history.replace({
                        pathname: privateRoute.jobList.path,
                        search: stringify({ country: item.code }),
                      });
                    }}>
                    <Typography variant="button">{item.name}</Typography>
                  </ListItem>
                ))}
              </List>
            </div>
          }>
          <ListItem
            button
            component={Link}
            to={jobList.path}
            className={classes.item}
            selected={location.pathname.startsWith(jobList.path)}>
            <ListItemIcon className={classes.icon}>{<WorkOutlineOutlinedIcon />}</ListItemIcon>
            <ListItemText className={classes.text} primary={t("Job")} />
          </ListItem>
        </Dropdown>
      </Hidden>

      <MenuItem
        {...companyList}
        name={t("Company")}
        icon={<LocationCityOutlinedIcon />}
        visible={isSuper || isAdmin || isCompany}
      />
      <MenuItem {...candidateList} name={t("Candidate")} icon={<AssignmentIndOutlinedIcon />} visible={!isCompany} />
      <MenuItem {...referList} name={t("Refer history")} icon={<DateRangeOutlinedIcon />} />

      <Hidden mdUp>
        <MenuItem {...userList} name={t("User")} icon={<GroupOutlinedIcon />} visible={isSuper || isAdmin} />
      </Hidden>

      <Hidden smDown>
        <Dropdown
          placement="bottomLeft"
          getPopupContainer={(event) => event.parentNode}
          overlay={
            <div>
              <List disablePadding component={Paper}>
                {USER_TABS.map((item) => (
                  <ListItem
                    key={item.id}
                    button
                    selected={item.code === type}
                    onClick={() => {
                      history.replace({
                        pathname: privateRoute.userList.path,
                        search: stringify({ type: item.code }),
                      });
                    }}>
                    <Typography variant="button">{item.name}</Typography>
                  </ListItem>
                ))}
              </List>
            </div>
          }>
          <ListItem
            button
            component={Link}
            to={userList.path}
            className={classes.item}
            selected={location.pathname.startsWith(userList.path)}>
            <ListItemIcon className={classes.icon}>{<GroupOutlinedIcon />}</ListItemIcon>
            <ListItemText className={classes.text} primary={t("User")} />
          </ListItem>
        </Dropdown>
      </Hidden>

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

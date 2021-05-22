import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loading } from "components";
import { Button, Divider, Grid, IconButton, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { reportService } from "services/report";
import { t } from "utils/common";
import { privateRoute } from "routes";

import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WorkOutlineOutlinedIcon from "@material-ui/icons/WorkOutlineOutlined";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import DateRangeOutlinedIcon from "@material-ui/icons/DateRangeOutlined";
import RefreshOutlinedIcon from "@material-ui/icons/RefreshOutlined";

const Board = ({ visible, name = "-", value = 0, extra, Icon, url, color }) => {
  const classes = useStyles();
  return visible ? (
    <Grid item xs={12} md={6}>
      <Paper className={classes.cardContainer} style={{ backgroundColor: `${color}DD` }}>
        <div className={classes.cardTop}>
          <div style={{ color: "#FFF" }}>
            <Typography variant="h3">{value}</Typography>
            <Typography variant="h5">{name}</Typography>
            <Typography variant="subtitle1">{extra}</Typography>
          </div>
          <Icon className={classes.cardIcon} style={{ color: "#FFF" }} />
        </div>
        <Divider />
        <Link to={url} className={classes.cardBottom} style={{ backgroundColor: `${color}FF`, color: "#FFF" }}>
          {t("View")}
        </Link>
      </Paper>
    </Grid>
  ) : null;
};

const Home = () => {
  const { isSuper, isAdmin, isUser, isRecruit, isCompany } = useSelector(({ profile }) => profile);

  const [dashboard, setDashboard] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchData = React.useCallback(() => {
    setIsLoading(true);
    reportService
      .getDashboard()
      .then((response) => {
        const { status = 1, data: { dashboard } = {} } = response;
        if (status) {
          setDashboard(dashboard);
        }
      })
      .catch(console.warn)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Paper elevation={0} className="align-items-center mb-24" style={{ backgroundColor: "transparent" }}>
        <IconButton>
          <DashboardOutlinedIcon />
        </IconButton>
        <Typography variant="h6" className="flex-1">
          {t("Dashboard")}
        </Typography>

        <Button startIcon={<Loading visible={isLoading} icon={<RefreshOutlinedIcon />} />} onClick={fetchData}>
          {t("Refresh")}
        </Button>
      </Paper>

      <Grid container spacing={2}>
        <Board
          visible={isSuper || isAdmin || isRecruit || isCompany}
          name={t("Total Jobs")}
          color="#339f97"
          value={dashboard.totalJob}
          extra={`Open: ${dashboard.totalOpenJob ?? 0}`}
          Icon={WorkOutlineOutlinedIcon}
          url={privateRoute.jobList.path}
        />
        <Board
          visible={isSuper || isAdmin || isRecruit}
          name={t("Total Candidates")}
          color="#009551"
          value={dashboard.totalCv}
          extra={`Active: ${dashboard.totalOpenCv ?? 0}`}
          Icon={AssignmentIndOutlinedIcon}
          url={privateRoute.candidateList.path}
        />
        <Board
          visible={isSuper || isAdmin}
          name={t("Total Referral")}
          color="#dca146"
          value={dashboard.totalReferral}
          Icon={DateRangeOutlinedIcon}
          url={privateRoute.referList.path}
        />
        <Board
          visible={isSuper || isAdmin}
          name={t("Total Users")}
          color="#3949ab"
          value={dashboard.totalUser}
          Icon={GroupOutlinedIcon}
          url={privateRoute.userList.path}
        />

        <Board
          visible={isCompany && isUser}
          name={t("Total Companies referral")}
          color="#9c27b0"
          value={dashboard.totalCompanyReferral}
          Icon={WorkOutlineOutlinedIcon}
          url={privateRoute.referList.path}
        />
        <Board
          visible={isRecruit && isUser}
          name={t("Total Candidates referral")}
          color="#ec407a"
          value={dashboard.totalUserReferral}
          Icon={AssignmentIndOutlinedIcon}
          url={privateRoute.referList.path}
        />
      </Grid>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  cardContainer: {},
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  cardIcon: {
    fontSize: 102,
    opacity: 0.5,
  },
  cardBottom: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default Home;

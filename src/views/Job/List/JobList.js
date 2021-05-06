import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Spin, Tag } from "antd";
import { Avatar, Button, Grid, IconButton, Paper, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { jobService } from "services/job";
import { formatCurrency, formatBonus, normalizeJob } from "utils/converter";
import { t } from "utils/common";
import { privateRoute } from "routes";
import { JOB_STATUS_TYPES } from "utils/constants";
import JobSearch from "./JobSearch";

import WorkOutlineOutlinedIcon from "@material-ui/icons/WorkOutlineOutlined";
import DirectionsOutlinedIcon from "@material-ui/icons/DirectionsOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";

const JobList = () => {
  const { isSuper, isAdmin, isCompany } = useSelector(({ profile }) => profile);

  const [dataList, setDataList] = React.useState([]);
  const [dataCount, setDataCount] = React.useState(0);
  const [dataSearch, setDataSearch] = React.useState({ page: 0 });
  const [dataLoading, setDataLoading] = React.useState(false);

  const fetchData = React.useCallback(() => {
    setDataLoading(true);
    jobService
      .getListInfoJob({
        search: dataSearch,
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { jobs, total } = data;
          setDataList(jobs.map(normalizeJob));
          setDataCount(total);
        }
      })
      .catch(console.warn)
      .finally(() => {
        setDataLoading(false);
      });
  }, [dataSearch]);

  const handleClickSearch = (nextSearch) => {
    setDataSearch((search) => ({
      ...search,
      ...nextSearch,
      page: 0,
    }));
  };

  const TablePagination = () => (
    <Pagination
      shape="rounded"
      variant="outlined"
      color="secondary"
      count={Math.ceil(dataCount / 10)}
      page={dataSearch.page + 1}
      onChange={(event, nextPage) => {
        setDataSearch((search) => ({
          ...search,
          page: nextPage - 1,
        }));
      }}
    />
  );

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Typography variant="h6" className="align-items-center mb-24">
        <IconButton>
          <WorkOutlineOutlinedIcon />
        </IconButton>
        {t("Jobs list")}

        <div className="flex-1" />

        {(isSuper || isAdmin || isCompany) && (
          <Link to={privateRoute.jobCreate.path}>
            <Button variant="contained" color="secondary" startIcon={<AddOutlinedIcon />}>
              {t("Create job")}
            </Button>
          </Link>
        )}
      </Typography>
      <JobSearch onSearch={handleClickSearch} />

      <Paper className="justify-content-between align-items-center p-16 mb-24">
        <Typography>
          {dataCount} {t("jobs matched")}
        </Typography>
        <TablePagination />
      </Paper>

      <Spin spinning={dataLoading}>
        {dataList.map((job) => (
          <Paper className="flex-row p-16 mb-24" key={job.idJob}>
            <div style={{ padding: "6px 12px 12px 0px" }}>
              <Avatar src={job.avatar} style={{ width: 72, height: 72, backgroundColor: "transparent" }}>
                <Avatar src="/kai_avatar.png" style={{ width: 72, height: 72 }} />
              </Avatar>
            </div>
            <div className="flex-1">
              <Link to={privateRoute.jobView.url(job.idJob)}>
                <Typography component="span" variant="h6" color="primary">
                  {job.title}
                </Typography>
                <Tag
                  color={JOB_STATUS_TYPES.find((item) => item.code === job.status)?.color}
                  style={{ position: "absolute", marginTop: 6, marginLeft: 8 }}>
                  {JOB_STATUS_TYPES.find((item) => item.code === job.status)?.name}
                </Tag>
              </Link>

              <Typography variant="subtitle2">
                {t("Company")}: {job.company}
              </Typography>

              <Typography variant="body2" color="textSecondary">
                {t("Number of vacancies")}: <span style={{ color: "black" }}>{job.numberOfVacancies}</span>
              </Typography>

              <Typography variant="h6" color="textSecondary">
                {t("Bonus")}:{" "}
                <span style={{ color: job.bonus > 0 ? "green" : "silver" }}>{formatBonus(job.bonus)}</span>
              </Typography>

              <Grid container spacing={4}>
                <Grid item style={{ width: 240 }}>
                  <Typography>{t("Salary range")}</Typography>
                  <Typography>
                    {formatCurrency(job.currency, job.fromSalary)} - {formatCurrency(job.currency, job.toSalary)}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>{t("Workplace")}</Typography>
                  <Typography>{job.workplace}</Typography>
                </Grid>
              </Grid>
            </div>
            <div>
              <Link to={privateRoute.jobView.url(job.idJob)}>
                <IconButton>
                  <DirectionsOutlinedIcon color="secondary" />
                </IconButton>
              </Link>
              <IconButton>
                <BookmarkBorderOutlinedIcon />
              </IconButton>
            </div>
          </Paper>
        ))}
      </Spin>
      {dataCount > 0 && (
        <div className="justify-content-center">
          <TablePagination />
        </div>
      )}
    </>
  );
};

export default JobList;

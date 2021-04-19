import React from "react";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { Avatar, Grid, IconButton, Paper, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { jobService } from "services/job";
import { t } from "utils/common";
import { privateRoute } from "routes";
import JobSearch from "./JobSearch";

import WorkOutlineOutlinedIcon from "@material-ui/icons/WorkOutlineOutlined";
import DirectionsOutlinedIcon from "@material-ui/icons/DirectionsOutlined";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";

const JobList = () => {
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
          setDataList(jobs);
          setDataCount(total);
        }
      })
      .catch(console.warn)
      .then(() => {
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
        {t("Danh sách Job")}
      </Typography>
      <JobSearch onSearch={handleClickSearch} />

      <Paper className="justify-content-between align-items-center p-16 mb-24">
        <Typography>{dataCount} việc làm phù hợp</Typography>
        <TablePagination />
      </Paper>

      <Spin spinning={dataLoading}>
        {dataList.map((job) => (
          <Paper className="flex-row p-16 mb-24" key={job.idJob}>
            <div style={{ padding: "6px 12px 12px 0px" }}>
              <Avatar variant="rounded" src={job.avatar} className="bordered" style={{ width: 72, height: 72 }} />
            </div>
            <div className="flex-1">
              <Typography>Công ty: {job.company}</Typography>
              <Link to={privateRoute.jobView.url(job.idJob)}>
                <Typography component="span" color="primary">
                  {job.title}
                </Typography>
              </Link>

              <Typography>Số lượng tuyển: {job.numberOfVacancies}</Typography>

              <Grid container spacing={4}>
                {job.bonus > 0 && (
                  <Grid item style={{ width: 240 }}>
                    <Typography>Thưởng</Typography>
                    <Typography>{job.bonus}</Typography>
                  </Grid>
                )}
                <Grid item style={{ width: 240 }}>
                  <Typography>Mức lương</Typography>
                  <Typography>
                    {job.fromSalary} - {job.toSalary}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>Địa chỉ</Typography>
                  <Typography>{job.workplace}</Typography>
                </Grid>
              </Grid>
            </div>
            <div>
              <IconButton color="primary">
                <DirectionsOutlinedIcon />
              </IconButton>
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

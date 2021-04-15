import React from "react";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { Avatar, Grid, IconButton, Paper, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { jobService } from "services/job";
import { privateRoute } from "routes";
import JobSearch from "./JobSearch";

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
      .getListInfoJob({ ...dataSearch })
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

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const TablePagination = () => (
    <Pagination
      shape="rounded"
      variant="outlined"
      color="primary"
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

  return (
    <>
      <JobSearch />
      <Paper className="justify-content-between align-items-center p-16 mb-24">
        <Typography>{dataCount} việc làm phù hợp</Typography>
        <TablePagination />
      </Paper>
      <Spin spinning={dataLoading}>
        {dataList.map((item) => (
          <Paper className="flex-row p-16 mb-24" key={item.idJob}>
            <div style={{ padding: "6px 12px 12px 0px" }}>
              <Avatar variant="rounded" src={item.avatar} className="bordered" style={{ width: 72, height: 72 }} />
            </div>
            <div className="flex-1">
              <Typography>Công ty: {item.company}</Typography>
              <Link to={privateRoute.jobItem.url(item.idJob)}>
                <Typography component="span" color="primary">
                  {item.title}
                </Typography>
              </Link>

              <Typography>Số lượng tuyển: {item.numberOfVacancies}</Typography>

              <Grid container spacing={4}>
                {item.bonus > 0 && (
                  <Grid item style={{ width: 240 }}>
                    <Typography>Thưởng</Typography>
                    <Typography>{item.bonus}</Typography>
                  </Grid>
                )}
                <Grid item style={{ width: 240 }}>
                  <Typography>Mức lương</Typography>
                  <Typography>
                    {item.fromSalary} - {item.toSalary}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>Địa chỉ</Typography>
                  <Typography>{item.workplace}</Typography>
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
      <div className="justify-content-center">
        <TablePagination />
      </div>
    </>
  );
};

export default JobList;

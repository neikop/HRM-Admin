import React from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { IconButton, Paper, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { candidateService } from "services/candidate";
import { t } from "utils/common";
import { unix } from "moment";
import { privateRoute } from "routes";
import CandidateSearch from "./CandidateSearch";
import CandidateItem from "./CandidateItem";

import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import DirectionsOutlinedIcon from "@material-ui/icons/DirectionsOutlined";

const CandidateList = () => {
  const [dataList, setDataList] = React.useState([]);
  const [dataCount, setDataCount] = React.useState(0);
  const [dataSearch, setDataSearch] = React.useState({ page: 0 });
  const [dataSort, setDataSort] = React.useState();
  const [dataLoading, setDataLoading] = React.useState(false);

  const fetchData = React.useCallback(() => {
    setDataLoading(true);
    candidateService
      .getListInfoCv({
        search: dataSearch,
        sort: dataSort,
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { curriculumVitaes, total } = data;
          setDataList(curriculumVitaes);
          setDataCount(total);
        }
      })
      .catch(console.warn)
      .then(() => {
        setDataLoading(false);
      });
  }, [dataSearch, dataSort]);

  const handleClickSearch = (nextSearch) => {
    setDataSearch((search) => ({
      ...search,
      ...nextSearch,
      page: 0,
    }));
  };

  const handleTableChange = (...[, , sorter]) => {
    const { field, order } = sorter;
    if (order === "ascend") setDataSort(`${field}-asc`);
    else if (order === "descend") setDataSort(`${field}-desc`);
    else setDataSort();
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
          <AssignmentIndOutlinedIcon />
        </IconButton>
        {t("Candidate list")}
      </Typography>
      <CandidateSearch onSearch={handleClickSearch} />

      <Paper className="justify-content-between align-items-center p-16 mb-24">
        <Typography>
          {dataCount} {t("Candidates")}
        </Typography>
        <TablePagination />
      </Paper>

      <Paper className="mb-24">
        <Table
          bordered={false}
          loading={dataLoading}
          rowKey={(record) => record.id}
          dataSource={dataList}
          pagination={false}
          onChange={handleTableChange}
          columns={[
            { title: t("Name"), dataIndex: "name", sorter: true, render: (_, record) => record.candidateName },
            { title: t("Skill"), dataIndex: "skill" },
            { title: t("Language"), dataIndex: "language" },
            { title: t("Level"), dataIndex: "level", sorter: true },
            {
              title: t("Time"),
              dataIndex: "time",
              sorter: true,
              render: (_, record) => unix(record.updateTime / 1000).format("DD-MM-YYYY"),
            },
            {
              title: t("Calendar"),
              dataIndex: "calendar",
              sorter: true,
              render: (_, record) => unix(record.calendarReminder / 1000).format("DD-MM-YYYY"),
            },
            { title: t("Status"), dataIndex: "status", sorter: true },
            {
              dataIndex: "",
              render: (_, record) => (
                <Link to={privateRoute.candidateView.url(record.id)}>
                  <DirectionsOutlinedIcon />
                </Link>
              ),
            },
          ]}
          expandable={{
            expandedRowRender: (record) => <CandidateItem candidate={record} />,
          }}
        />
      </Paper>
      {dataCount > 0 && (
        <div className="justify-content-center">
          <TablePagination />
        </div>
      )}
    </>
  );
};

export default CandidateList;

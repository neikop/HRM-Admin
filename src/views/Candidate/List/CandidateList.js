import React from "react";
import { Link } from "react-router-dom";
import { Alert, Loading } from "components";
import { Popconfirm, Table } from "antd";
import { Button, IconButton, Paper, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { candidateService } from "services/candidate";
import { t } from "utils/common";
import { unix } from "moment";
import { privateRoute } from "routes";
import { DDMMYYYY } from "utils/constants";
import CandidateSearch from "./CandidateSearch";
import CandidateItem from "./CandidateItem";

import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import DirectionsOutlinedIcon from "@material-ui/icons/DirectionsOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

const CandidateList = () => {
  const [dataList, setDataList] = React.useState([]);
  const [dataCount, setDataCount] = React.useState(0);
  const [dataSearch, setDataSearch] = React.useState({ page: 0 });
  const [dataSort, setDataSort] = React.useState();
  const [dataLoading, setDataLoading] = React.useState(false);

  const [isLoadingDelete, setIsLoadingDelete] = React.useState(0);

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
      .finally(() => {
        setDataLoading(false);
      });
  }, [dataSearch, dataSort]);

  const handleConfirmDelete = (item) => {
    setIsLoadingDelete(item.id);
    candidateService
      .deleteCv({
        params_request: {
          id: item.id,
        },
      })
      .then((response) => {
        Alert.success({ message: t("Delete candidate successfully") });

        fetchData();
      })
      .catch(console.warn)
      .finally(() => {
        setIsLoadingDelete();
      });
  };

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

        <div className="flex-1" />
        <Link to={privateRoute.candidateCreate.path}>
          <Button variant="contained" color="secondary" startIcon={<AddOutlinedIcon />}>
            {t("Create candidate")}
          </Button>
        </Link>
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
              render: (_, record) => unix(record.updateTime / 1000).format(DDMMYYYY),
            },
            {
              title: t("Calendar"),
              dataIndex: "calendar",
              sorter: true,
              render: (_, record) => unix(record.calendarReminder / 1000).format(DDMMYYYY),
            },
            { title: t("Status"), dataIndex: "status", sorter: true },
            {
              dataIndex: "",
              align: "right",
              render: (_, record) => (
                <Typography noWrap>
                  <Link to={privateRoute.candidateUpdate.url(record.id)}>
                    <IconButton>
                      <DirectionsOutlinedIcon color="secondary" />
                    </IconButton>
                  </Link>
                  <Popconfirm
                    placement="topRight"
                    title={t("Are you sure?")}
                    onConfirm={() => handleConfirmDelete(record)}>
                    <IconButton>
                      <Loading visible={isLoadingDelete === record.id} icon={<DeleteOutlinedIcon color="error" />} />
                    </IconButton>
                  </Popconfirm>
                </Typography>
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

import React from "react";
import { Link } from "react-router-dom";
import { Alert, Loading } from "components";
import { Popconfirm, Table, Tag } from "antd";
import { Button, IconButton, Paper, Tooltip, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { candidateService } from "services/candidate";
import { t } from "utils/common";
import { unix } from "moment";
import { privateRoute } from "routes";
import { CANDIDATE_STATUS_TYPES, DDMMYYYY_HHMM } from "utils/constants";
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
      siblingCount={0}
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
      <Typography variant="h6" className="align-items-center flex-wrap mb-24">
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

      <Paper className="justify-content-between align-items-center flex-wrap p-16 mb-24">
        <Typography>
          {dataCount} {t("Candidates")}
        </Typography>
        <TablePagination />
      </Paper>

      <Paper className="mb-24">
        <Table
          scroll={{ x: 800 }}
          bordered={false}
          loading={dataLoading}
          rowKey={(record) => record.id}
          dataSource={dataList}
          pagination={false}
          onChange={handleTableChange}
          columns={[
            {
              title: t("Name"),
              dataIndex: "name",
              width: 180,
              sorter: true,
              render: (_, record) => record.candidateName,
            },
            {
              title: t("Skill"),
              dataIndex: "skill",
              width: 180,
              render: (_, record) => (record.skill ?? []).map((item, index) => <Tag key={index}>{item}</Tag>),
            },
            { title: t("Language"), dataIndex: "language", width: 120 },
            { title: t("Level"), dataIndex: "level", width: 120, sorter: true },
            {
              title: t("Created at"),
              dataIndex: "time",
              width: 120,
              sorter: true,
              render: (_, record) => unix(record.updateTime).format(DDMMYYYY_HHMM),
            },
            {
              title: t("Calendar"),
              dataIndex: "calendar",
              width: 120,
              sorter: true,
              render: (_, record) => unix(record.calendarReminder).format(DDMMYYYY_HHMM),
            },
            {
              title: t("Status"),
              dataIndex: "status",
              width: 100,
              sorter: true,
              render: (_, record) => CANDIDATE_STATUS_TYPES.find((item) => item.code === record.status)?.name,
            },
            {
              dataIndex: "",
              align: "right",
              width: 128,
              render: (_, record) => (
                <Typography noWrap>
                  <Link to={privateRoute.candidateUpdate.url(record.id)}>
                    <Tooltip title={t("View detail")}>
                      <IconButton>
                        <DirectionsOutlinedIcon color="secondary" />
                      </IconButton>
                    </Tooltip>
                  </Link>
                  <Popconfirm
                    placement="topRight"
                    title={t("Are you sure?")}
                    onConfirm={() => handleConfirmDelete(record)}>
                    <Tooltip title={t("Delete")}>
                      <IconButton>
                        <Loading visible={isLoadingDelete === record.id} icon={<DeleteOutlinedIcon color="error" />} />
                      </IconButton>
                    </Tooltip>
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

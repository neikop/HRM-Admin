import React from "react";
import { Table } from "antd";
import { Alert, Loading } from "components";
import { Button, IconButton, Paper, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { candidateService } from "services/candidate";
import { jobService } from "services/job";
import { t } from "utils/common";
import { unix } from "moment";
import { CANDIDATE_STATUS_TYPES, DDMMYYYY } from "utils/constants";
import { CandidateItem, CandidateSearch } from "views/Candidate/List";

import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";

const CandidatePopup = ({ job: { idJob }, onClose }) => {
  const [dataList, setDataList] = React.useState([]);
  const [dataCount, setDataCount] = React.useState(0);
  const [dataSearch, setDataSearch] = React.useState({ page: 0, idJob });
  const [dataSort, setDataSort] = React.useState();
  const [dataLoading, setDataLoading] = React.useState(false);

  const [isLoadingSelect, setIsLoadingSelect] = React.useState(0);

  const fetchData = React.useCallback(() => {
    setDataLoading(true);
    candidateService
      .getReferralCv({
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

  const handleClickSelect = (item) => {
    setIsLoadingSelect(item.id);
    jobService
      .applyCvToJob({
        params_request: {
          idJob,
          idCV: item.id,
        },
      })
      .then((response) => {
        Alert.success({ message: t("Refer candidate successfully") });

        onClose();
      })
      .catch(console.warn)
      .finally(() => {
        setIsLoadingSelect();
      });
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
    <Paper className="p-16">
      <Typography variant="h6" className="align-items-center mb-24">
        <IconButton>
          <AssignmentIndOutlinedIcon />
        </IconButton>
        {t("Candidate list")}

        <div className="flex-1" />
        <IconButton onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </Typography>
      <CandidateSearch onSearch={handleClickSearch} />

      <Paper className="mb-24">
        <Table
          scroll={{ y: 480, x: 800 }}
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
            { title: t("Language"), dataIndex: "language", width: 120 },
            { title: t("Level"), dataIndex: "level", width: 120, sorter: true },
            {
              title: t("Created at"),
              dataIndex: "time",
              width: 120,
              sorter: true,
              render: (_, record) => unix(record.updateTime).format(DDMMYYYY),
            },
            {
              title: t("Calendar"),
              dataIndex: "calendar",
              width: 120,
              sorter: true,
              render: (_, record) => unix(record.calendarReminder).format(DDMMYYYY),
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
              width: 80,
              render: (_, record) => (
                <Button
                  color="secondary"
                  startIcon={<Loading visible={isLoadingSelect === record.id} />}
                  onClick={() => handleClickSelect(record)}>
                  {t("Select")}
                </Button>
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
    </Paper>
  );
};

export default CandidatePopup;

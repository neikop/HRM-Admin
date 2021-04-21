import React from "react";
import { Table } from "antd";
import { Button, IconButton, Paper, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { Loading } from "components";
import { candidateService } from "services/candidate";
import { t } from "utils/common";
import { privateRoute } from "routes";
import { CandidateItem, CandidateSearch } from "views/Candidate/List";

import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";

const CandidatePopup = ({ job: { idJob } }, onClose) => {
  const [dataList, setDataList] = React.useState([]);
  const [dataCount, setDataCount] = React.useState(0);
  const [dataSearch, setDataSearch] = React.useState({ page: 0, idJob });
  const [dataSort, setDataSort] = React.useState();
  const [dataLoading, setDataLoading] = React.useState(false);

  const [isLoadingRecord, setIsLoadingRecord] = React.useState();

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

  const handleClickChose = (item) => {
    setIsLoadingRecord(item.id);
    candidateService
      .applyCvToJob({
        params_request: {
          idJob,
          idCV: item.id,
        },
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          console.log(data);
        }
      })
      .catch(console.warn)
      .then(() => {
        setIsLoadingRecord();
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
        {t("Danh sách Ứng viên")}
      </Typography>
      <CandidateSearch onSearch={handleClickSearch} />

      <Paper className="mb-24">
        <Table
          scroll={{ y: 420 }}
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
            { title: t("Time"), dataIndex: "time", sorter: true, render: (_, record) => record.updateTime },
            {
              title: t("Calendar"),
              dataIndex: "calendar",
              sorter: true,
              render: (_, record) => record.calendarReminder,
            },
            { title: t("Status"), dataIndex: "status", sorter: true },
            {
              dataIndex: "",
              render: (_, record) => (
                <Button variant="primary" onClick={() => handleClickChose(record)}>
                  <Loading visible={isLoadingRecord === record.id} /> Chọn
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

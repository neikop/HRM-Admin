import React from "react";
import { useParams } from "react-router-dom";
import { Alert, Loading } from "components";
import { Popconfirm, Select, Table } from "antd";
import { Button, IconButton, Paper, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { DateTimePicker } from "@material-ui/pickers";
import { jobService } from "services/job";
import { t, getUnix } from "utils/common";
import { DDMMYYYY_HHMM, REFERRAL_STATUS_TYPES } from "utils/constants";

import RefreshOutlinedIcon from "@material-ui/icons/RefreshOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

const Referral = ({ job }) => {
  const { id } = useParams();

  const [dataList, setDataList] = React.useState([]);
  const [dataCount, setDataCount] = React.useState(0);
  const [dataSearch, setDataSearch] = React.useState({ page: 0, idJob: Number(id) });
  const [dataLoading, setDataLoading] = React.useState(false);

  const [isLoadingDelete, setIsLoadingDelete] = React.useState(0);
  const [isLoadingSelect, setIsLoadingSelect] = React.useState(0);
  const [isLoadingPicker, setIsLoadingPicker] = React.useState(0);

  const fetchData = React.useCallback(() => {
    setDataLoading(true);
    jobService
      .getListJobCvApplied({
        params_request: dataSearch,
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { jobCvApplied, total } = data;
          setDataList(jobCvApplied);
          setDataCount(total);
        }
      })
      .catch(console.warn)
      .finally(() => {
        setDataLoading(false);
      });
  }, [dataSearch]);

  const handleChangeStatus = (item, { status = item.status, interviewDate = item.interviewDate }) => {
    jobService
      .applyCvToJob({
        params_request: {
          idJob: item.idJob,
          idCV: item.idCv,
          status,
          interviewDate,
        },
      })
      .then((response) => {
        Alert.success({ message: t("Update referral successfully") });

        Object.assign(item, { status, interviewDate });
      })
      .catch(console.warn)
      .finally(() => {
        setIsLoadingSelect();
        setIsLoadingPicker();
      });
  };

  const handleConfirmDelete = (item) => {
    setIsLoadingDelete(item.id);
    jobService
      .deleteApplyCvToJob({
        params_request: {
          idJob: item.idJob,
          idCV: item.idCv,
        },
      })
      .then((response) => {
        Alert.success({ message: t("Delete referral successfully") });

        fetchData();
      })
      .catch(console.warn)
      .finally(() => {
        setIsLoadingDelete();
      });
  };

  const TablePagination = () => (
    <Pagination
      shape="rounded"
      variant="outlined"
      color="secondary"
      count={Math.ceil(dataCount / 5)}
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
      <Paper className="justify-content-between align-items-center p-16 mb-24">
        <Typography>
          {dataCount} {t("Referrals")}
        </Typography>

        <Button startIcon={<Loading visible={dataLoading} icon={<RefreshOutlinedIcon />} />} onClick={fetchData}>
          {t("Refresh")}
        </Button>
      </Paper>

      <Paper className="mb-24">
        <Table
          bordered={false}
          loading={dataLoading}
          rowKey={(record) => record.id}
          dataSource={dataList}
          pagination={false}
          columns={[
            { title: t("Candidate"), dataIndex: "name", render: (_, record) => record.candidateName },
            { title: t("Job title"), dataIndex: "title" },
            { title: t("Company"), dataIndex: "company" },
            {
              title: t("Interview Date"),
              dataIndex: "interviewDate",
              render: (_, record) => (
                <DateTimePicker
                  size="small"
                  color="secondary"
                  placeholder={DDMMYYYY_HHMM}
                  format={DDMMYYYY_HHMM}
                  loadingIndicator={isLoadingPicker === record.id}
                  value={record.interviewDate * 1000 || null}
                  onChange={(value) => {
                    setIsLoadingPicker(record.id);
                    handleChangeStatus(record, { interviewDate: getUnix(value) });
                  }}
                  minDate={new Date()}
                  minDateMessage={t("Interview time has passed")}
                />
              ),
            },
            {
              title: t("Status"),
              dataIndex: "status",
              render: (_, record) => (
                <Select
                  value={record.status}
                  onChange={(value) => {
                    setIsLoadingSelect(record.id);
                    handleChangeStatus(record, { status: value });
                  }}
                  loading={isLoadingSelect === record.id}
                  style={{ width: 180 }}>
                  {REFERRAL_STATUS_TYPES.map((item) => (
                    <Select.Option key={item.id} value={item.code}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              ),
            },
            {
              dataIndex: "",
              align: "right",
              render: (_, record) => (
                <Popconfirm
                  placement="topRight"
                  title={t("Are you sure?")}
                  onConfirm={() => handleConfirmDelete(record)}>
                  <IconButton>
                    <Loading visible={isLoadingDelete === record.id} icon={<DeleteOutlinedIcon color="error" />} />
                  </IconButton>
                </Popconfirm>
              ),
            },
          ]}
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

export default Referral;

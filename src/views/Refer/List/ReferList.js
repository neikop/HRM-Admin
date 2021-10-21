import React from "react";
import { useSelector } from "react-redux";
import { Alert, Loading } from "components";
import { Popconfirm, Select, Table } from "antd";
import { Button, IconButton, Link as NavLink, Paper, Tooltip, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { DateTimePicker } from "@material-ui/pickers";
import { jobService } from "services/job";
import { t, getUnix } from "utils/common";
import { DDMMYYYY_HHMM, REFERRAL_STATUS_TYPES } from "utils/constants";

import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import DateRangeOutlinedIcon from "@material-ui/icons/DateRangeOutlined";
import RefreshOutlinedIcon from "@material-ui/icons/RefreshOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

import DetailRefer from "./DetailRefer";

import ReferSearch from "./ReferSearch";


const ReferList = ({ showSearch = true, paramsRequest }) => {
  const { isSuper, isAdmin, isRecruit } = useSelector(({ profile }) => profile);

  const [dataList, setDataList] = React.useState([]);
  const [dataCount, setDataCount] = React.useState(0);
  const [dataSearch, setDataSearch] = React.useState({ page: 0 });
  const [dataLoading, setDataLoading] = React.useState(false);

  const [isLoadingDelete, setIsLoadingDelete] = React.useState(0);
  const [isLoadingSelect, setIsLoadingSelect] = React.useState(0);
  const [isLoadingPicker, setIsLoadingPicker] = React.useState(0);

  const fetchData = React.useCallback(() => {
    setDataLoading(true);
    console.log(dataSearch)
    jobService
      .getListJobCvApplied({
        params_request: { ...dataSearch, ...paramsRequest }
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { jobCvApplied, total } = data;
          setDataList(jobCvApplied);
          setDataCount(total);
        }
      })
      .finally(() => {
        setDataLoading(false);
      });
  }, [dataSearch, paramsRequest]);

  const handleChangeStatus = (item, { status = item.status, interviewDate = item.interviewDate }) => {
    // if (!interviewDate) {
    //   Alert.error({ message: t("Update Interview Date First") });
    //   setIsLoadingPicker();
    //   setIsLoadingSelect();
    // } else
      jobService
        .applyCvToJob({
          params_request: {
            idJob: item.idJob,
            idCv: item.idCv,
            status,
            interviewDate,
          },
        })
        .then((response) => {
          Alert.success({ message: t("Update referral successfully") });

          Object.assign(item, { status, interviewDate });
        })
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
          idCv: item.idCv,
        },
      })
      .then((response) => {
        Alert.success({ message: t("Delete referral successfully") });

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
      <Paper elevation={0} className="align-items-center mb-24" style={{ backgroundColor: "transparent" }}>
        <IconButton>
          <DateRangeOutlinedIcon />
        </IconButton>
        <Typography variant="h6" className="flex-1">
          {t("Referral list")}
        </Typography>

        <Button startIcon={<Loading visible={dataLoading} icon={<RefreshOutlinedIcon />} />} onClick={fetchData}>
          {t("Refresh")}
        </Button>
      </Paper>

      {showSearch && (
        <>
          <ReferSearch onSearch={handleClickSearch} />
          <Paper className="justify-content-between align-items-center flex-wrap p-16 mb-24">
            <Typography>
              {dataCount} {t("refers matched")}
            </Typography>
            <TablePagination />
          </Paper>
        </>
      )}

      <Paper className="mb-24">
        <Table
          scroll={{ x: 1200 }}
          bordered={false}
          loading={dataLoading}
          rowKey={(record) => record.id}
          dataSource={dataList}
          pagination={false}
          columns={[
            {
              title: t("Candidate"),
              dataIndex: "name",
              width: 180,
              render: (_, record) => record.candidateName,
            },
            { title: t("Manager Candidate"), dataIndex: "nameUserCreate", width: 180 },
            {
              title: t("Skill"),
              dataIndex: "skill",
              width: 120,
              render: (_, record) => record.candidateSkill,
            },
            { title: t("Job title"), dataIndex: "title", width: 240 },
            { title: t("Company"), dataIndex: "company", width: 120 },
            {
              title: t("Interview Date"),
              dataIndex: "interviewDate",
              width: 240,
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
              width: 200,
              render: (_, record) => (
                <Select
                  disabled={!isSuper && !isAdmin && !isRecruit}
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
              width: 80,
              render: (_, record) => (
                <Typography noWrap>
                  <NavLink hidden={!record.urlCv[0]} href={record.urlCv[0]} target="_blank">
                    <Tooltip title={t("View CV")}>
                      <IconButton>
                        <AssignmentOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </NavLink>
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
            expandedRowRender: (record) => <DetailRefer refer={record} />,
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

export default ReferList;

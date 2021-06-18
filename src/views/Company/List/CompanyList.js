import React from "react";
import { Link } from "react-router-dom";
import { Alert, Loading } from "components";
import { Popconfirm, Table } from "antd";
import { Avatar, Button, IconButton, Paper, Tooltip, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { companyService } from "services/company";
import { t } from "utils/common";
import { privateRoute } from "routes";
import CompanySearch from "./CompanySearch";

import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import DirectionsOutlinedIcon from "@material-ui/icons/DirectionsOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

const CompanyList = () => {
  const [dataList, setDataList] = React.useState([]);
  const [dataCount, setDataCount] = React.useState(0);
  const [dataSearch, setDataSearch] = React.useState({ page: 0 });
  const [dataLoading, setDataLoading] = React.useState(false);

  const [isLoadingDelete, setIsLoadingDelete] = React.useState(0);

  const fetchData = React.useCallback(() => {
    setDataLoading(true);
    companyService
      .getListInfoCompany({
        params_request: dataSearch,
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { companies, total } = data;
          setDataList(companies);
          setDataCount(total);
        }
      })
      .finally(() => {
        setDataLoading(false);
      });
  }, [dataSearch]);

  const handleConfirmDelete = (item) => {
    setIsLoadingDelete(item.id);
    companyService
      .deleteCompany({
        params_request: {
          id: item.id,
        },
      })
      .then((response) => {
        Alert.success({ message: t("Delete company successfully") });

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
        {t("Company list")}

        <div className="flex-1" />
        <Link to={privateRoute.companyCreate.path}>
          <Button variant="contained" color="secondary" startIcon={<AddOutlinedIcon />}>
            {t("Create company")}
          </Button>
        </Link>
      </Typography>
      <CompanySearch onSearch={handleClickSearch} />

      <Paper className="justify-content-between align-items-center flex-wrap p-16 mb-24">
        <Typography>
          {dataCount} {t("Companies")}
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
          columns={[
            {
              title: t("Company"),
              dataIndex: "name",
              width: 240,
              render: (_, record) => (
                <div className="align-items-center">
                  <Avatar src={record.image} className="mr-12" />
                  <Typography>{record.name}</Typography>
                </div>
              ),
            },
            { title: t("Address"), dataIndex: "address" },
            { title: t("URL"), dataIndex: "link", render: (_, record) => <a href={record.link}>{record.link}</a> },
            {
              dataIndex: "",
              align: "right",
              width: 128,
              render: (_, record) => (
                <Typography noWrap>
                  <Link to={privateRoute.companyDetail.url(record.id)}>
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

export default CompanyList;

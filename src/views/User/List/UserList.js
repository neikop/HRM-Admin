import React from "react";
import { Link } from "react-router-dom";
import { Alert, Loading } from "components";
import { Popconfirm, Select, Table } from "antd";
import { Button, IconButton, Paper, Tooltip, Typography } from "@material-ui/core";
import { userService } from "services/user";
import { t } from "utils/common";
import { unix } from "moment";
import { privateRoute } from "routes";
import { DDMMYYYY, USER_ROLES, USER_TYPES } from "utils/constants";

import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import RefreshOutlinedIcon from "@material-ui/icons/RefreshOutlined";
import DirectionsOutlinedIcon from "@material-ui/icons/DirectionsOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

const UserList = () => {
  const [dataList, setDataList] = React.useState([]);
  const [dataLoading, setDataLoading] = React.useState(false);

  const [isLoadingDelete, setIsLoadingDelete] = React.useState(0);
  const [isLoadingSelect, setIsLoadingSelect] = React.useState(0);

  const fetchData = React.useCallback(() => {
    setDataLoading(true);
    userService
      .getListUser({
        params_request: { page: 0 },
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { users } = data;
          setDataList(users);
        }
      })
      .catch(console.warn)
      .finally(() => {
        setDataLoading(false);
      });
  }, []);

  const handleChangeRole = (item, roleId) => {
    setIsLoadingSelect(item.userId);
    userService
      .updateRole({
        params_request: {
          memberId: item.userId,
          roleId,
        },
      })
      .then((response) => {
        Alert.success({ message: t("Update role successfully") });

        Object.assign(item, { roleId });
      })
      .catch(console.warn)
      .finally(() => {
        setIsLoadingSelect();
      });
  };

  const handleConfirmDelete = (item) => {
    setIsLoadingDelete(item.userId);
    userService
      .deleteUser({
        params_request: {
          memberId: item.userId,
          memberName: item.username,
        },
      })
      .then((response) => {
        Alert.success({ message: t("Delete user successfully") });

        fetchData();
      })
      .catch(console.warn)
      .finally(() => {
        setIsLoadingDelete();
      });
  };

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Paper elevation={0} className="align-items-center mb-24" style={{ backgroundColor: "transparent" }}>
        <IconButton>
          <GroupOutlinedIcon />
        </IconButton>
        <Typography variant="h6" className="flex-1">
          {t("User list")}
        </Typography>

        <Button startIcon={<Loading visible={dataLoading} icon={<RefreshOutlinedIcon />} />} onClick={fetchData}>
          {t("Refresh")}
        </Button>
      </Paper>

      <Paper className="justify-content-between align-items-center p-16 mb-24">
        <Typography>
          {dataList.length} {t("Users")}
        </Typography>
      </Paper>

      <Paper className="mb-24">
        <Table
          scroll={{ y: 600, x: 800 }}
          bordered={false}
          loading={dataLoading}
          rowKey={(record) => record.userId}
          dataSource={dataList}
          pagination={false}
          columns={[
            {
              title: t("Username"),
              dataIndex: "username",
              width: 180,
            },
            {
              title: t("Role"),
              dataIndex: "roleId",
              width: 160,
              render: (_, record) => (
                <Select
                  value={record.roleId}
                  onChange={(value) => handleChangeRole(record, value)}
                  loading={isLoadingSelect === record.userId}
                  style={{ width: 140 }}>
                  {USER_ROLES.map((item) => (
                    <Select.Option key={item.id} value={item.code}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              ),
            },
            {
              title: t("Type"),
              dataIndex: "userType",
              width: 120,
              render: (_, record) => USER_TYPES.find((item) => item.code === record.userType)?.name,
            },
            {
              title: t("Created at"),
              dataIndex: "createdAt",
              width: 120,
              render: (_, record) => unix(record.createdAt).format(DDMMYYYY),
            },
            {
              dataIndex: "",
              align: "right",
              width: 128,
              render: (_, record) => (
                <Typography noWrap>
                  <Link to={privateRoute.userUpdate.url(record.userId)}>
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
                        <Loading
                          visible={isLoadingDelete === record.userId}
                          icon={<DeleteOutlinedIcon color="error" />}
                        />
                      </IconButton>
                    </Tooltip>
                  </Popconfirm>
                </Typography>
              ),
            },
          ]}
        />
      </Paper>
    </>
  );
};

export default UserList;

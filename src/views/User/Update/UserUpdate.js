import React from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Loading } from "components";
import { Avatar, Button, IconButton, Paper, Typography } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Col, Form, Input, Row, Select } from "antd";
import { userService } from "services/user";
import { getUnix, t } from "utils/common";
import { unix } from "moment";
import { privateRoute } from "routes";
import { DDMMYYYY, USER_ROLES, USER_TYPES } from "utils/constants";

import NavigateBeforeOutlinedIcon from "@material-ui/icons/NavigateBeforeOutlined";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";

const UserUpdate = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [user, setUser] = React.useState({});
  const [dayOfBirth, setDayOfBirth] = React.useState(null);

  const [isLoadingCreate, setIsLoadingUpdate] = React.useState(false);

  const fetchData = React.useCallback(() => {
    userService
      .getUserInfo({
        params_request: { userId: id },
      })
      .then((response) => {
        const { status = 1, data: { user } = {} } = response;
        if (status) {
          setUser(user);
          const { dayOfBirth } = user;
          if (dayOfBirth) setDayOfBirth(unix(dayOfBirth));

          form.setFieldsValue({ ...user });
        }
      })
      .catch(console.warn);
  }, [id, form]);

  const handleClickSubmit = () => {
    form.validateFields().then((values) => {
      setIsLoadingUpdate(true);
      userService
        .updateUserInfo({
          params_request: {
            memberId: id,
            ...values,
            dayOfBirth: getUnix(dayOfBirth),
          },
        })
        .then((response) => {
          Alert.success({ message: t("Update user successfully") });

          fetchData();
        })
        .catch(console.warn)
        .finally(() => {
          setIsLoadingUpdate(false);
        });
    });
  };

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Paper elevation={0} className="align-items-center mb-24" style={{ backgroundColor: "transparent" }}>
        <Link to={privateRoute.userList.path}>
          <IconButton>
            <NavigateBeforeOutlinedIcon />
          </IconButton>
        </Link>
        <Typography variant="h6">{t("Update user")}</Typography>
      </Paper>

      <Paper className="p-16">
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label={t("Avatar")} className="Job-Avatar">
                <Avatar variant="square" src={user.avatarUrl} />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} span={24}>
              <Form.Item name="fullName" label={t("Name")}>
                <Input disabled />
              </Form.Item>
              <Form.Item name="phone" label={t("Phone")}>
                <Input disabled />
              </Form.Item>
              <Form.Item label={t("Date of Birth")}>
                <KeyboardDatePicker
                  disabled
                  clearable
                  color="secondary"
                  placeholder={DDMMYYYY}
                  format={DDMMYYYY}
                  value={dayOfBirth}
                  onChange={setDayOfBirth}
                  maxDate={new Date()}
                  helperText=""
                />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} span={24}>
              <Form.Item label={t("Username")}>
                <Input disabled value={user.username} />
              </Form.Item>
              <Form.Item label={t("Email")}>
                <Input disabled value={user.email} />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} span={24}>
              <Form.Item label={t("Type")}>
                <Select disabled value={user.userType}>
                  {USER_TYPES.map((item) => (
                    <Select.Option key={item.id} value={item.code}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={t("Role")}>
                <Select disabled value={user.roleId}>
                  {USER_ROLES.map((item) => (
                    <Select.Option key={item.id} value={item.code}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Button
          disabled
          variant="outlined"
          startIcon={<Loading visible={isLoadingCreate} icon={<CheckOutlinedIcon />} />}
          onClick={handleClickSubmit}>
          {t("Update user")}
        </Button>
      </Paper>
    </>
  );
};
export default UserUpdate;

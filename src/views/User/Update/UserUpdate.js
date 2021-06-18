import React from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, Box, IconButton, Paper, Typography } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Col, Form, Input, Row, Tabs } from "antd";
import { userService } from "services/user";
import { t } from "utils/common";
import { unix } from "moment";
import { privateRoute } from "routes";
import { DDMMYYYY, USER_ROLES, USER_TYPES } from "utils/constants";

import NavigateBeforeOutlinedIcon from "@material-ui/icons/NavigateBeforeOutlined";

const UserUpdate = () => {
  const { id } = useParams();

  const [form] = Form.useForm();
  const [user, setUser] = React.useState({});
  const [dayOfBirth, setDayOfBirth] = React.useState(null);

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
  }, [id, form]);

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
        <Typography variant="h6">{t("User information")}</Typography>
      </Paper>

      <Row gutter={[24, 24]}>
        <Col xl={8} lg={12} span={24}>
          <Paper className="p-16">
            <Box className="Picture-Large flex-center flex-column mb-24">
              <Avatar src={user.avatarUrl} />
              <Typography variant="h6" color="textSecondary">
                {user.fullName}
              </Typography>
            </Box>
            {[
              { label: t("Username"), value: user.username },
              { label: t("Email"), value: user.email },
              { label: t("Type"), value: USER_TYPES.find((item) => item.code === user.userType)?.name },
              { label: t("Role"), value: USER_ROLES.find((item) => item.code === user.roleId)?.name },
            ].map(({ label, value }, index) => (
              <Row gutter={24} key={index} className="mb-12">
                <Col xl={8} lg={24} md={8} span={24}>
                  <Typography color="textSecondary">{label}</Typography>
                </Col>
                <Col xl={16} lg={24} md={16} span={24}>
                  <Typography style={{ wordBreak: "break-word" }}>{value}</Typography>
                </Col>
              </Row>
            ))}
          </Paper>
        </Col>
        <Col xl={16} lg={12} span={24}>
          <Paper className="pl-16 pr-16 pb-16">
            <Tabs animated>
              <Tabs.TabPane tab={t("Account Info")} key="account-info">
                <Row>
                  <Col xl={12} lg={24} span={24}>
                    <Form form={form} layout="vertical">
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
                    </Form>
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </Paper>
        </Col>
      </Row>
    </>
  );
};
export default UserUpdate;

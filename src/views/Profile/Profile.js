import React from "react";
import { useSelector } from "react-redux";
import { Alert, Loading } from "components";
import { Button, IconButton, Paper, Typography } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Col, Form, Input, Row, Select } from "antd";
import { userService } from "services/user";
import { getUnix, t } from "utils/common";
import { unix } from "moment";
import { DDMMYYYY, USER_TYPES } from "utils/constants";

import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";

const Profile = () => {
  const { userId } = useSelector(({ profile }) => profile);

  const [form] = Form.useForm();
  const [user, setUser] = React.useState({});
  const [dayOfBirth, setDayOfBirth] = React.useState(null);

  const [isLoadingCreate, setIsLoadingUpdate] = React.useState(false);

  const fetchData = React.useCallback(() => {
    if (userId)
      userService
        .getUserInfo({
          params_request: { userId },
        })
        .then((response) => {
          const { status = 1, data: { user } = {} } = response;
          if (status) {
            setUser(user);
            const { dayOfBirth } = user;
            if (dayOfBirth) setDayOfBirth(unix(dayOfBirth / 1000));

            form.setFieldsValue({ ...user });
          }
        })
        .catch(console.warn);
  }, [userId, form]);

  const handleClickSubmit = () => {
    form.validateFields().then((values) => {
      setIsLoadingUpdate(true);
      userService
        .updateUserInfo({
          params_request: {
            memberId: userId,
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
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
        <Typography variant="h6">{t("Profile")}</Typography>
      </Paper>

      <Paper className="p-16">
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name="fullName" label={t("Name")}>
                <Input />
              </Form.Item>
              <Form.Item name="phone" label={t("Phone")}>
                <Input />
              </Form.Item>
              <Form.Item label={t("Date of Birth")}>
                <KeyboardDatePicker
                  clearable
                  color="secondary"
                  helperText=""
                  placeholder={DDMMYYYY}
                  format={DDMMYYYY}
                  value={dayOfBirth}
                  onChange={setDayOfBirth}
                  maxDate={new Date()}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={t("Username")}>
                <Input disabled value={user.username} />
              </Form.Item>
              <Form.Item label={t("Email")}>
                <Input disabled value={user.email} />
              </Form.Item>
              <Form.Item label={t("Type")}>
                <Select disabled value={user.userType}>
                  {USER_TYPES.map((item) => (
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
          variant="outlined"
          startIcon={<Loading visible={isLoadingCreate} icon={<CheckOutlinedIcon />} />}
          onClick={handleClickSubmit}>
          {t("Update user")}
        </Button>
      </Paper>
    </>
  );
};
export default Profile;

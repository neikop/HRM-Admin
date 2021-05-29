import React from "react";
import { useSelector } from "react-redux";
import { Alert, Loading } from "components";
import { Avatar, Box, Button, IconButton, Paper, Typography } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Col, Form, Input, Row, Tabs, Upload } from "antd";
import { profileAction } from "actions/profile";
import { userService } from "services/user";
import { fileService } from "services/file";
import { getUnix, t } from "utils/common";
import { unix } from "moment";
import { DDMMYYYY, USER_ROLES, USER_TYPES } from "utils/constants";
import UpdatePassword from "./UpdatePassword";

import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";

const Profile = () => {
  const { userId } = useSelector(({ profile }) => profile);

  const [form] = Form.useForm();
  const [user, setUser] = React.useState({});
  const [dayOfBirth, setDayOfBirth] = React.useState(null);

  const [isLoadingUpload, setIsLoadingUpload] = React.useState(true);
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
            if (dayOfBirth) setDayOfBirth(unix(dayOfBirth));

            form.setFieldsValue({ ...user });

            setIsLoadingUpload(false);
            profileAction.update(user);
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

  const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("avatar_user", file);

    setIsLoadingUpload(true);
    fileService
      .uploadFile(formData)
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { url: avatarUrl } = data;
          form.setFieldsValue({ avatarUrl });
        }
      })
      .catch(console.warn)
      .finally(() => {
        setIsLoadingUpload(false);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { avatarUrl } = form.getFieldsValue();

  return (
    <>
      <Paper elevation={0} className="align-items-center mb-24" style={{ backgroundColor: "transparent" }}>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
        <Typography variant="h6">{t("Profile")}</Typography>
      </Paper>

      <Row gutter={[24, 24]}>
        <Col xl={8} lg={12} span={24}>
          <Paper className="p-16">
            <Box className="Job-Avatar flex-center flex-column mb-24">
              <Avatar src={avatarUrl} />
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
                      <Form.Item name="avatarUrl" hidden>
                        <Input />
                      </Form.Item>
                      <Box display="flex">
                        <Avatar src={avatarUrl} className="mr-8" />
                        <Form.Item>
                          <Upload accept="image/*" showUploadList={false} customRequest={handleUploadAvatar}>
                            <Button variant="outlined" startIcon={<Loading visible={isLoadingUpload} />}>
                              Change Avatar
                            </Button>
                          </Upload>
                        </Form.Item>
                      </Box>

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
                          placeholder={DDMMYYYY}
                          format={DDMMYYYY}
                          value={dayOfBirth}
                          onChange={setDayOfBirth}
                          maxDate={new Date()}
                          helperText=""
                        />
                      </Form.Item>
                      <Button
                        variant="outlined"
                        startIcon={<Loading visible={isLoadingCreate} icon={<CheckOutlinedIcon />} />}
                        onClick={handleClickSubmit}>
                        {t("Update user")}
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab={t("Change Password")} key="change-password">
                <Row>
                  <Col xl={12} lg={24} span={24}>
                    <UpdatePassword />
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
export default Profile;

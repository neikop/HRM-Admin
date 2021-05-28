import React from "react";
import { useSelector } from "react-redux";
import { Alert, Loading } from "components";
import { Avatar, Button, IconButton, Paper, Typography } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Col, Form, Input, Row, Select, Upload } from "antd";
import { profileAction } from "actions/profile";
import { userService } from "services/user";
import { fileService } from "services/file";
import { getUnix, t } from "utils/common";
import { unix } from "moment";
import { DDMMYYYY, USER_ROLES, USER_TYPES } from "utils/constants";

import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";

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

      <Paper className="p-16">
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name="avatarUrl" hidden>
                <Input />
              </Form.Item>
              <Form.Item label={t("Avatar")}>
                <Upload
                  className="Job-Avatar"
                  accept="image/*"
                  listType="picture-card"
                  showUploadList={false}
                  customRequest={handleUploadAvatar}>
                  {avatarUrl ? (
                    <Avatar variant="square" src={avatarUrl} />
                  ) : (
                    <Loading visible={isLoadingUpload} icon={<AddOutlinedIcon />} />
                  )}
                </Upload>
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} span={24}>
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

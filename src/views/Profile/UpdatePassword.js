import React from "react";
import { useSelector } from "react-redux";
import { Alert, Loading } from "components";
import { Button } from "@material-ui/core";
import { Form, Input } from "antd";
import { userService } from "services/user";
import { t } from "utils/common";

import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";

const UpdatePassword = () => {
  const { email } = useSelector(({ profile }) => profile);

  const [form] = Form.useForm();
  const [isLoadingCreate, setIsLoadingUpdate] = React.useState(false);

  const handleClickSubmit = () => {
    form.validateFields().then((values) => {
      const { newPassword, rePassword } = values;
      if (newPassword !== rePassword) {
        Alert.error({ message: t("Password does not match") });
        return;
      }
      setIsLoadingUpdate(true);
      userService
        .changePassword({
          params_request: {
            ...values,
            email,
          },
        })
        .then((response) => {
          Alert.success({ message: t("Change password successfully") });

          form.resetFields();
        })
        .catch(console.warn)
        .finally(() => {
          setIsLoadingUpdate(false);
        });
    });
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="oldPassword"
        label={t("Old Password")}
        rules={[{ required: true, message: t("Old Password is required") }]}>
        <Input type="password" />
      </Form.Item>
      <Form.Item
        name="newPassword"
        label={t("New Password")}
        rules={[{ required: true, message: t("New Password is required") }]}>
        <Input type="password" />
      </Form.Item>
      <Form.Item
        name="rePassword"
        label={t("Re Password")}
        rules={[{ required: true, message: t("Re Password is required") }]}>
        <Input type="password" />
      </Form.Item>
      <Button
        variant="outlined"
        startIcon={<Loading visible={isLoadingCreate} icon={<CheckOutlinedIcon />} />}
        onClick={handleClickSubmit}>
        {t("Change Password")}
      </Button>
    </Form>
  );
};

export default UpdatePassword;

import React from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Loading, RichTextEditor } from "components";
import { Avatar, Button, IconButton, Paper, Typography } from "@material-ui/core";
import { Col, Form, Input, Row, Upload } from "antd";
import { fileService } from "services/file";
import { companyService } from "services/company";
import { browserHistory } from "utils/history";
import { t } from "utils/common";
import { privateRoute } from "routes";
import { decode } from "html-entities";

import NavigateBeforeOutlinedIcon from "@material-ui/icons/NavigateBeforeOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

const CompanyCreate = () => {
  const { id } = useParams();

  const [form] = Form.useForm();
  const [description, setDescription] = React.useState("");

  const [isLoadingUpload, setIsLoadingUpload] = React.useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = React.useState(false);

  const fetchData = React.useCallback(() => {
    if (id)
      companyService
        .getInfoCompany({
          params_request: { id: Number(id) },
        })
        .then((response) => {
          const { status = 1, data } = response;
          if (status) {
            const { description, ...job } = data;
            setTimeout(() => {
              if (description) setDescription(decode(description));
            }, 0);

            form.setFieldsValue({ ...job });
          }
        })
        .catch(console.warn);
  }, [id, form]);

  const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("company", file);

    setIsLoadingUpload(true);
    fileService
      .uploadFile(formData)
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { url: image } = data;
          form.setFieldsValue({ image });
        }
      })
      .catch(console.warn)
      .finally(() => {
        setIsLoadingUpload(false);
      });
  };

  const handleClickCreate = () => {
    form
      .validateFields()
      .then((values) => {
        setIsLoadingCreate(true);
        companyService
          .createCompany({
            params_request: {
              ...values,
              description,
            },
          })
          .then((response) => {
            Alert.success({ message: t("Create company successfully") });

            browserHistory.push(privateRoute.companyList.path);
          })
          .catch(console.warn)
          .finally(() => {
            setIsLoadingCreate(false);
          });
      })
      .catch(console.warn);
  };

  const handleClickUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        setIsLoadingCreate(true);
        companyService
          .updateCompany({
            params_request: {
              id: Number(id),
              ...values,
              description,
            },
          })
          .then((response) => {
            Alert.success({ message: t("Update company successfully") });

            browserHistory.push(privateRoute.companyView.url(id));
          })
          .catch(console.warn)
          .finally(() => {
            setIsLoadingCreate(false);
          });
      })
      .catch(console.warn);
  };

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { image } = form.getFieldsValue();

  return (
    <>
      <Paper elevation={0} className="align-items-center mb-24" style={{ backgroundColor: "transparent" }}>
        <Link to={privateRoute.companyList.path}>
          <IconButton>
            <NavigateBeforeOutlinedIcon />
          </IconButton>
        </Link>
        <Typography variant="h6">{id ? t("Update company") : t("Create company")}</Typography>
      </Paper>

      <Paper className="p-16">
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col lg={12} span={24}>
              <Row gutter={24}>
                <Col>
                  <Form.Item name="image" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item label={t("Picture")} className="Picture-Large">
                    <Upload
                      accept="image/*"
                      listType="picture-card"
                      showUploadList={false}
                      customRequest={handleUploadAvatar}>
                      {image ? (
                        <Avatar variant="square" src={image} />
                      ) : (
                        <Loading visible={isLoadingUpload} icon={<AddOutlinedIcon />} />
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
                <Col flex={1}>
                  <Form.Item name="name" label={t("Name")} rules={[{ required: true, message: t("Name is required") }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="link"
                    label={t("URL")}
                    rules={[
                      {
                        pattern: /https?:\/\/([\w-]+\.)*([\w-]+)(\.[\w-]+)+(\/.*)?/,
                        message: "URL is invalid",
                      },
                    ]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="address"
                label={t("Address")}
                rules={[{ required: true, message: t("Address is required") }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col lg={12} span={24}>
              <Form.Item label={t("Description")}>
                <RichTextEditor height={320} value={description} onChange={setDescription} />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {id ? (
          <Button
            variant="outlined"
            startIcon={<Loading visible={isLoadingCreate} icon={<EditOutlinedIcon />} />}
            onClick={handleClickUpdate}>
            {t("Update company")}
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<Loading visible={isLoadingCreate} icon={<AddOutlinedIcon />} />}
            onClick={handleClickCreate}>
            {t("Create company")}
          </Button>
        )}
      </Paper>
    </>
  );
};

export default CompanyCreate;

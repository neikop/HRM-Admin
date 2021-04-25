import React from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, InputNumberFormat, Loading, RichTextEditor } from "components";
import { Avatar, Button, IconButton, Paper, Typography } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Col, Form, Input, Radio, Row, Select, Upload } from "antd";
import { fileService } from "services/file";
import { jobService } from "services/job";
import { browserHistory } from "utils/history";
import { normalizeJob } from "utils/converter";
import { getUnix, t } from "utils/common";
import { unix } from "moment";
import { decode } from "html-entities";
import { privateRoute } from "routes";
import { DDMMYYYY, JOB_STATUS_TYPES, JOB_FORMS, CURRENCY_TYPES } from "utils/constants";

import NavigateBeforeOutlinedIcon from "@material-ui/icons/NavigateBeforeOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

const JobCreate = () => {
  const { id } = useParams();

  const [form] = Form.useForm();
  const [deadline, setDeadline] = React.useState(null);
  const [description, setDescription] = React.useState("");
  const [requirement, setRequirement] = React.useState("");
  const [welfare, setWelfare] = React.useState("");

  const [isLoadingUpload, setIsLoadingUpload] = React.useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = React.useState(false);

  const fetchData = React.useCallback(() => {
    if (id)
      jobService
        .getInfoJob({
          params_request: { idJob: Number(id) },
        })
        .then((response) => {
          const { status = 1, data } = response;
          if (status) {
            const { deadline, description, requirement, welfare, ...job } = normalizeJob(data);
            if (deadline) setDeadline(unix(deadline));
            if (description) setDescription(decode(description));
            if (requirement) setRequirement(decode(requirement));
            if (welfare) setWelfare(decode(welfare));

            form.setFieldsValue({ ...job });
          }
        })
        .catch(console.warn);
  }, [id, form]);

  const handleUploadFile = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("image_job", file);

    setIsLoadingUpload(true);
    fileService
      .uploadFile(formData)
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { url: avatar } = data;
          form.setFieldsValue({ avatar });
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
        jobService
          .createJob({
            params_request: {
              idJobType: 1,
              ...values,
              deadline: getUnix(deadline),
              description,
              requirement,
              welfare,
            },
          })
          .then((response) => {
            Alert.success({ message: t("Create job successfully") });

            browserHistory.push(privateRoute.jobList.path);
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
        jobService
          .updateJob({
            params_request: {
              idJob: Number(id),
              ...values,
              deadline: getUnix(deadline),
              description,
              requirement,
              welfare,
            },
          })
          .then((response) => {
            Alert.success({ message: t("Update job successfully") });

            browserHistory.push(privateRoute.jobView.url(id));
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

  const { avatar } = form.getFieldsValue();

  return (
    <>
      <Paper elevation={0} className="align-items-center mb-24" style={{ backgroundColor: "transparent" }}>
        <Link to={privateRoute.jobList.path}>
          <IconButton>
            <NavigateBeforeOutlinedIcon />
          </IconButton>
        </Link>
        <Typography variant="h6">{t("Create job")}</Typography>
      </Paper>

      <Paper className="p-16">
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col span={12}>
              <Row gutter={24}>
                <Col>
                  <Form.Item name="avatar" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item label={t("Picture")}>
                    <Upload
                      className="Job-Avatar"
                      accept="image/*"
                      listType="picture-card"
                      showUploadList={false}
                      customRequest={handleUploadFile}>
                      {avatar ? (
                        <Avatar variant="square" src={avatar} />
                      ) : (
                        <Loading visible={isLoadingUpload} icon={<AddOutlinedIcon />} />
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
                <Col flex={1}>
                  <Form.Item
                    name="title"
                    label={t("Title")}
                    rules={[{ required: true, message: t("Title is required") }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="company"
                    label={t("Company")}
                    rules={[{ required: true, message: t("Company is required") }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="workplace"
                    label={t("Workplace")}
                    rules={[{ required: true, message: t("Wordplace is required") }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="position" label={t("Position")}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="form"
                    label={t("Type")}
                    initialValue={JOB_FORMS[0].code}
                    rules={[{ required: true, message: t("Type is required") }]}>
                    <Select allowClear>
                      {JOB_FORMS.map((item) => (
                        <Select.Option key={item.id} value={item.code}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t("Deadline")} required>
                    <KeyboardDatePicker
                      clearable
                      color="secondary"
                      helperText=""
                      placeholder={DDMMYYYY}
                      format={DDMMYYYY}
                      value={deadline}
                      onChange={setDeadline}
                    />
                  </Form.Item>
                  <Form.Item name="numberOfVacancies" label={t("Number of vacancies")}>
                    <InputNumberFormat customInput={Input} />
                  </Form.Item>
                  <Form.Item name="bonus" label={t("Bonus")}>
                    <InputNumberFormat customInput={Input} thousandSeparator addonAfter="VND" />
                  </Form.Item>
                  <Form.Item name="status" label={t("Status")} initialValue={JOB_STATUS_TYPES[0].code}>
                    <Radio.Group>
                      {JOB_STATUS_TYPES.map((item) => (
                        <Radio.Button key={item.id} value={item.code}>
                          {item.name}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="fromSalary"
                    label={t("From Salary")}
                    rules={[{ required: true, message: t("Salary is required") }]}>
                    <InputNumberFormat
                      customInput={Input}
                      thousandSeparator
                      addonAfter={
                        <Form.Item
                          name="currency"
                          initialValue={CURRENCY_TYPES[0].code}
                          style={{ marginBottom: -1, marginTop: -1 }}>
                          <Select className="select-before">
                            {CURRENCY_TYPES.map((item) => (
                              <Select.Option key={item.id} value={item.code}>
                                {item.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="toSalary" label="To Salary">
                    <InputNumberFormat
                      customInput={Input}
                      thousandSeparator
                      addonAfter={
                        <Form.Item name="currency" style={{ marginBottom: -1, marginTop: -1 }}>
                          <Select className="select-before">
                            {CURRENCY_TYPES.map((item) => (
                              <Select.Option key={item.id} value={item.code}>
                                {item.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Form.Item label={t("Description")}>
                <RichTextEditor value={description} onChange={setDescription} />
              </Form.Item>
              <Form.Item label={t("Requirement")}>
                <RichTextEditor value={requirement} onChange={setRequirement} />
              </Form.Item>
              <Form.Item label={t("Welfare")}>
                <RichTextEditor value={welfare} onChange={setWelfare} />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {id ? (
          <Button
            variant="outlined"
            startIcon={<Loading visible={isLoadingCreate} icon={<EditOutlinedIcon />} />}
            onClick={handleClickUpdate}>
            {t("Update job")}
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<Loading visible={isLoadingCreate} icon={<AddOutlinedIcon />} />}
            onClick={handleClickCreate}>
            {t("Create job")}
          </Button>
        )}
      </Paper>
    </>
  );
};

export default JobCreate;

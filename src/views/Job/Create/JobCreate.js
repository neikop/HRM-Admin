import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useLocation } from "react-router-dom";
import { Alert, InputNumberFormat, Loading, RichTextEditor } from "components";
import { Avatar, Button, IconButton, Paper, Typography } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Col, Form, Input, Row, Select, Upload } from "antd";
import { fileService } from "services/file";
import { jobService } from "services/job";
import { browserHistory } from "utils/history";
import { normalizeJob } from "utils/converter";
import { getUnix, t } from "utils/common";
import { unix } from "moment";
import { decode } from "html-entities";
import { privateRoute } from "routes";
import { DDMMYYYY, JOB_STATUS_TYPES, JOB_FORMS, CURRENCY_TYPES } from "utils/constants";
import { parse } from "query-string";
import { SelectCompany } from "views/Company/Components";

import NavigateBeforeOutlinedIcon from "@material-ui/icons/NavigateBeforeOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";

const JobCreate = () => {
  const location = useLocation();
  const { idCompany } = parse(location.search);
  const { id } = useParams();
  const { isSuper, isAdmin } = useSelector(({ profile }) => profile);
  console.log(idCompany);

  const [form] = Form.useForm();
  const [deadline, setDeadline] = React.useState(null);
  const [description, setDescription] = React.useState("");
  const [requirement, setRequirement] = React.useState("");
  const [welfare, setWelfare] = React.useState("");
  const [company, setCompany] = React.useState();

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
            const { deadline, description, requirement, welfare, company, ...job } = normalizeJob(data);
            setTimeout(() => {
              if (deadline) setDeadline(unix(deadline));
              if (description) setDescription(decode(description));
              if (requirement) setRequirement(decode(requirement));
              if (welfare) setWelfare(decode(welfare));
              if (company) setCompany(company);
            }, 0);

            form.setFieldsValue({
              ...job,
              idCompany: company?.id,
            });
          }
        });
  }, [id, form]);

  const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
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
      .finally(() => {
        setIsLoadingUpload(false);
      });
  };

  const handleUploadJob = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("jd_job", file);

    fileService
      .uploadFile(formData)
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { url: jobDescription } = data;
          form.setFieldsValue({ jobDescription });
          onSuccess();
        }
      })
      .catch(onError);
  };

  const handleClickCreate = () => {
    form.validateFields().then((values) => {
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
        .finally(() => {
          setIsLoadingCreate(false);
        });
    });
  };

  const handleClickUpdate = () => {
    form.validateFields().then((values) => {
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
        .finally(() => {
          setIsLoadingCreate(false);
        });
    });
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
        <Typography variant="h6">{id ? t("Update job") : t("Create job")}</Typography>
      </Paper>

      <Paper className="p-16">
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col lg={12} span={24}>
              <Row gutter={24}>
                <Col>
                  <Form.Item name="avatar" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item label={t("Picture")} className="Picture-Large">
                    <Upload
                      accept="image/*"
                      listType="picture-card"
                      showUploadList={false}
                      customRequest={handleUploadAvatar}>
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
                <Col md={12} span={24}>
                  <Form.Item
                    name="idCompany"
                    label={t("Company")}
                    rules={[{ required: true, message: t("Company is required") }]}>
                    <SelectCompany
                      initCompany={company}
                      initValue={company?.id}
                      onChange={(value) => form.setFieldsValue({ idCompany: value })}
                    />
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
                  <Form.Item name="form" label={t("Type")} initialValue={JOB_FORMS[0].code}>
                    <Select>
                      {JOB_FORMS.map((item) => (
                        <Select.Option key={item.id} value={item.code}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={12} span={24}>
                  <Form.Item label={t("Deadline")} required>
                    <KeyboardDatePicker
                      clearable
                      color="secondary"
                      placeholder={DDMMYYYY}
                      format={DDMMYYYY}
                      value={deadline}
                      onChange={setDeadline}
                      minDate={new Date()}
                      helperText=""
                    />
                  </Form.Item>
                  <Form.Item
                    name="numberOfVacancies"
                    label={t("Number of vacancies")}
                    rules={[{ required: true, message: t("Number is required") }]}>
                    <InputNumberFormat customInput={Input} />
                  </Form.Item>
                  <Form.Item name="bonus" label={t("Bonus")}>
                    <InputNumberFormat
                      customInput={Input}
                      thousandSeparator
                      addonAfter={
                        <Select defaultValue={CURRENCY_TYPES[0].code}>
                          <Select.Option value={CURRENCY_TYPES[0].code}>{CURRENCY_TYPES[0].name}</Select.Option>
                        </Select>
                      }
                    />
                  </Form.Item>
                  <Form.Item name="status" label={t("Status")} initialValue={JOB_STATUS_TYPES[1].code}>
                    <Select disabled={!(isSuper || isAdmin)}>
                      {JOB_STATUS_TYPES.map((item) => (
                        <Select.Option key={item.id} value={item.code}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col md={12} span={24}>
                  <Form.Item
                    name="fromSalary"
                    label={t("From Salary")}
                    rules={[{ required: true, message: t("Salary is required") }]}>
                    <InputNumberFormat
                      customInput={Input}
                      thousandSeparator
                      addonAfter={
                        <Form.Item name="currency" initialValue={CURRENCY_TYPES[0].code} style={{ margin: -1 }}>
                          <Select>
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
                <Col md={12} span={24}>
                  <Form.Item name="toSalary" label="To Salary">
                    <InputNumberFormat
                      customInput={Input}
                      thousandSeparator
                      addonAfter={
                        <Form.Item name="currency" style={{ margin: -1 }}>
                          <Select>
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
              <Row>
                <Col>
                  <Form.Item name="jobDescription" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item label={t("Job description")}>
                    <Upload accept="application/pdf" listType="picture" maxCount={1} customRequest={handleUploadJob}>
                      <Button variant="outlined" startIcon={<CloudUploadOutlinedIcon />}>
                        Upload
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col lg={12} span={24}>
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

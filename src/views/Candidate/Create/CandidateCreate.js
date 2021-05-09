import React from "react";
import { Link } from "react-router-dom";
import { Alert, Loading } from "components";
import { Button, IconButton, Paper, Typography } from "@material-ui/core";
import { KeyboardDatePicker, KeyboardDateTimePicker } from "@material-ui/pickers";
import { Col, Form, Input, Row, Select, Tabs, Upload } from "antd";
import { fileService } from "services/file";
import { candidateService } from "services/candidate";
import { browserHistory } from "utils/history";
import { getUnix, t } from "utils/common";
import { privateRoute } from "routes";
import { CANDIDATE_LEVELS, CANDIDATE_STATUS_TYPES, DDMMYYYY, DDMMYYYY_HHMM, SKILLS } from "utils/constants";

import NavigateBeforeOutlinedIcon from "@material-ui/icons/NavigateBeforeOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const CandidateCreate = () => {
  const [form] = Form.useForm();
  const [dayOfBirth, setDayOfBirth] = React.useState(null);
  const [calendarReminder, setCalendarReminder] = React.useState(null);

  const [isUpload, setUpload] = React.useState(true);
  const [isLoadingParser, setIsLoadingParser] = React.useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = React.useState(false);

  const handleFileParser = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("resume", file);

    setIsLoadingParser(true);
    fileService
      .resumeParser(formData)
      .then((response) => {
        const { name, ...data } = response;
        form.setFieldsValue({
          ...data,
          candidateName: name,
        });
      })
      .catch(console.warn)
      .finally(() => {
        setIsLoadingParser(false);
        uploadFile(file);
      });
  };

  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("cv", file);
    fileService
      .uploadFile(formData)
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          const { url: urlCv } = data;
          form.setFieldsValue({ urlCv });
        }
      })
      .catch(console.warn)
      .finally(() => {
        setUpload(false);
      });
  };

  const handleClickSubmit = () => {
    form.validateFields().then((values) => {
      setIsLoadingCreate(true);
      candidateService
        .createCv({
          params_request: {
            ...values,
            dayOfBirth: getUnix(dayOfBirth),
            calendarReminder: getUnix(calendarReminder),
          },
        })
        .then((response) => {
          Alert.success({ message: t("Create candidate successfully") });

          browserHistory.push(privateRoute.candidateList.path);
        })
        .catch(console.warn)
        .finally(() => {
          setIsLoadingCreate(false);
        });
    });
  };

  return (
    <>
      <Paper elevation={0} className="align-items-center mb-24" style={{ backgroundColor: "transparent" }}>
        <Link to={privateRoute.candidateList.path}>
          <IconButton>
            <NavigateBeforeOutlinedIcon />
          </IconButton>
        </Link>
        <Typography variant="h6">{t("Create candidate")}</Typography>
      </Paper>

      {isUpload ? (
        <Upload.Dragger accept="application/pdf" showUploadList={false} customRequest={handleFileParser}>
          <Typography variant="h4" color="textSecondary">
            {t("Upload candidate profile here")}
          </Typography>
          <CloudUploadIcon color="action" fontSize="large" />
          <Typography variant="body2" color="textSecondary">
            {t("After the file is uploaded, the system will get some basic information")}.
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mb-12">
            {t("Please complete the missing information")}.
          </Typography>
          <Button
            disableElevation
            variant="contained"
            color="secondary"
            startIcon={<Loading visible={isLoadingParser} icon={<CloudUploadIcon />} />}>
            {t("Upload FIle (.PDF only)")}
          </Button>
        </Upload.Dragger>
      ) : (
        <Paper className="p-16">
          <Form form={form} layout="vertical">
            <Row gutter={24}>
              <Col span={12}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item name="candidateName" label={t("Name")}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="address" label={t("Address")}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="level" label={t("Level")}>
                      <Select>
                        {CANDIDATE_LEVELS.map((item) => (
                          <Select.Option key={item.id} value={item.code}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="skill" label={t("Skill")}>
                      <Select mode="tags">
                        {SKILLS.map((skill) => (
                          <Select.Option key={skill} value={skill}>
                            {skill}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="email" label={t("Email")}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="phone" label={t("Phone")}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
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
                    <Form.Item name="language" label={t("Language")}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="position" label={t("Position")}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="status" label={t("Status")} initialValue={CANDIDATE_STATUS_TYPES[0].code}>
                      <Select>
                        {CANDIDATE_STATUS_TYPES.map((item) => (
                          <Select.Option key={item.id} value={item.code}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label={t("Calendar Reminder")}>
                      <KeyboardDateTimePicker
                        clearable
                        color="secondary"
                        placeholder={DDMMYYYY_HHMM}
                        format={DDMMYYYY_HHMM}
                        value={calendarReminder}
                        onChange={setCalendarReminder}
                        minDate={new Date()}
                        helperText=""
                      />
                    </Form.Item>
                    <Form.Item name="note" label={t("Note")}>
                      <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="urlCv" hidden>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={12}>
                <Tabs animated type="card" className="CV-Preview">
                  {[form.getFieldValue("urlCv")].map((url, index) => (
                    <Tabs.TabPane key={index} tab={`CV ${index + 1}`}>
                      <embed src={url} style={{ width: "100%", height: "100%" }} />
                    </Tabs.TabPane>
                  ))}
                </Tabs>
              </Col>
            </Row>
          </Form>

          <Button
            variant="outlined"
            startIcon={<Loading visible={isLoadingCreate} icon={<AddOutlinedIcon />} />}
            onClick={handleClickSubmit}>
            {t("Create candidate")}
          </Button>
        </Paper>
      )}
    </>
  );
};

export default CandidateCreate;

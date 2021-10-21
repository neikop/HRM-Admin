import React from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Loading } from "components";
import { Button, IconButton, Paper, Typography } from "@material-ui/core";
import { KeyboardDatePicker, KeyboardDateTimePicker } from "@material-ui/pickers";
import { Col, Form, Input, Row, Select, Tabs } from "antd";
import { candidateService } from "services/candidate";
import { getUnix, t } from "utils/common";
import { unix } from "moment";
import { privateRoute } from "routes";
import { CANDIDATE_LEVELS, CANDIDATE_STATUS_TYPES, DDMMYYYY, DDMMYYYY_HHMM, SKILLS } from "utils/constants";

import NavigateBeforeOutlinedIcon from "@material-ui/icons/NavigateBeforeOutlined";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";

const CandidateUpdate = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [candidate, setCandidate] = React.useState({});
  const [dayOfBirth, setDayOfBirth] = React.useState(null);
  const [calendarReminder, setCalendarReminder] = React.useState(null);

  const [isLoadingCreate, setIsLoadingCreate] = React.useState(false);

  const fetchData = React.useCallback(() => {
    candidateService
      .getInfoCv({
        params_request: { id },
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          setCandidate(data);
          const { dayOfBirth, calendarReminder } = data;
          if (dayOfBirth) setDayOfBirth(unix(dayOfBirth));
          if (calendarReminder) setCalendarReminder(unix(calendarReminder));

          form.setFieldsValue({ ...data });
        }
      })
  }, [id, form]);

  const handleClickSubmit = () => {
    form.validateFields().then((values) => {
      setIsLoadingCreate(true);
      candidateService
        .updateCv({
          params_request: {
            id,
            ...values,
            dayOfBirth: getUnix(dayOfBirth),
            calendarReminder: getUnix(calendarReminder),
          },
        })
        .then((response) => {
          Alert.success({ message: t("Update candidate successfully") });

          fetchData();
        })
        .finally(() => {
          setIsLoadingCreate(false);
        });
    });
  };

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Paper elevation={0} className="align-items-center mb-24" style={{ backgroundColor: "transparent" }}>
        <Link to={privateRoute.candidateList.path}>
          <IconButton>
            <NavigateBeforeOutlinedIcon />
          </IconButton>
        </Link>
        <Typography variant="h6">{t("Update candidate")}</Typography>
      </Paper>

      <Paper className="p-16">
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col lg={12} span={24}>
              <Row gutter={24}>
                
                <Col md={12} span={24}>
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
                
                <Col md={12} span={24}>
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
                  <Form.Item name="status" label={t("Status")}>
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
                 
                </Col>

                <Col md={24} span={24}>
                   <Form.Item name="note" label={t("Note")}>
                    <Input.TextArea rows={10} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col lg={12} span={24} style={{ minHeight: 600, marginBottom: 12 }}>
              <Tabs animated type="card" className="CV-Preview">
                {(candidate.urlCv ?? []).map((url, index) => (
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
          startIcon={<Loading visible={isLoadingCreate} icon={<CheckOutlinedIcon />} />}
          onClick={handleClickSubmit}>
          {t("Update candidate")}
        </Button>
      </Paper>
    </>
  );
};
export default CandidateUpdate;

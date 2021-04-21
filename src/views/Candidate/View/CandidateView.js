import React from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, Button, IconButton, Paper, Typography } from "@material-ui/core";
import { Col, Form, Input, Row, Select, Tabs } from "antd";
import { candidateService } from "services/candidate";
import { t } from "utils/common";
import { privateRoute } from "routes";

import NavigateBeforeOutlinedIcon from "@material-ui/icons/NavigateBeforeOutlined";

const LEVEL = [
  { id: 1, code: "Fresher", name: "Fresher" },
  { id: 2, code: "Junior", name: "Junior" },
  { id: 3, code: "Senior", name: "Senior" },
];

const CandidateView = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [candidate, setCandidate] = React.useState({});

  const fetchData = React.useCallback(() => {
    candidateService
      .getInfoCv({
        params_request: { id },
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          setCandidate(data);
          form.setFieldsValue({ ...data });
        }
      });
  }, [id, form]);

  const handleClickSubmit = () => {
    form.validateFields().then(console.log);
  };

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Paper elevation={0} className="align-items-center mb-24" style={{ backgroundColor: "transparent" }}>
        <Link to={privateRoute.candidate.path}>
          <IconButton>
            <NavigateBeforeOutlinedIcon />
          </IconButton>
        </Link>
        <Typography variant="h6">{t("Update candidate")}</Typography>
      </Paper>

      <Paper className="p-16">
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col span={12}>
              <Avatar
                variant="rounded"
                src={candidate.avatar}
                className="bordered"
                style={{ width: 144, height: 144, margin: "0px 24px 12px 0px" }}
              />
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
                      {LEVEL.map((item) => (
                        <Select.Option key={item.id} value={item.code}>
                          {item.name}
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
                  <Form.Item name="dayOfBirth" label={t("Date of Birth")}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="language" label={t("Language")}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="calendarReminder" label={t("Calendar Reminder")}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="position" label={t("Position")}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="note" label={t("Note")}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={12}>
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

        <Button variant="outlined" onClick={handleClickSubmit}>
          {t("Update")}
        </Button>
      </Paper>
    </>
  );
};
export default CandidateView;

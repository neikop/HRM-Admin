import React from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, ColorButton, Loading } from "components";
import { Avatar, Button, Dialog, Divider, IconButton, Paper, Typography } from "@material-ui/core";
import { Popconfirm, Tag } from "antd";
import { jobService } from "services/job";
import { browserHistory } from "utils/history";
import { formatCurrency, formatBonus, normalizeJob } from "utils/converter";
import { t } from "utils/common";
import { unix } from "moment";
import { decode } from "html-entities";
import { privateRoute } from "routes";
import { JOB_STATUS_TYPES } from "utils/constants";
import CandidatePopup from "views/Job/CandidatePopup";

import NavigateBeforeOutlinedIcon from "@material-ui/icons/NavigateBeforeOutlined";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

const JobView = () => {
  const { id } = useParams();
  const [job, setJob] = React.useState({});
  const [isLoadingDelete, setIsLoadingDelete] = React.useState(false);

  const [isOpenPopup, setIsOpenPopup] = React.useState(false);

  const fetchData = React.useCallback(() => {
    jobService
      .getInfoJob({
        params_request: { idJob: Number(id) },
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          setJob(normalizeJob(data));
        }
      })
      .catch(console.warn);
  }, [id]);

  const handleConfirmDelete = () => {
    setIsLoadingDelete(true);
    jobService
      .deleteJob({
        params_request: { idJob: Number(id) },
      })
      .then((response) => {
        Alert.success({ message: t("Delete job successfully") });

        browserHistory.replace(privateRoute.jobList.path);
      })
      .catch(console.warn)
      .finally(() => {
        setIsLoadingDelete(false);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Paper elevation={0} className="align-items-center mb-24" style={{ backgroundColor: "transparent" }}>
        <Link to={privateRoute.jobList.path}>
          <IconButton>
            <NavigateBeforeOutlinedIcon />
          </IconButton>
        </Link>
        <Typography variant="h6" color="secondary">
          {job.title}
        </Typography>
        <Tag color={JOB_STATUS_TYPES.find((item) => item.code === job.status)?.color} style={{ marginLeft: 8 }}>
          {JOB_STATUS_TYPES.find((item) => item.code === job.status)?.name}
        </Tag>

        <div className="flex-1" />
        <Popconfirm placement="topRight" title={t("Are you sure?")} onConfirm={() => handleConfirmDelete()}>
          <ColorButton
            variant="outlined"
            color="#d32f2f"
            startIcon={<Loading visible={isLoadingDelete} icon={<DeleteOutlinedIcon />} />}>
            {t("Delete job")}
          </ColorButton>
        </Popconfirm>
      </Paper>

      <Paper className="p-16">
        <div className="flex-row">
          <Avatar
            src={job.avatar}
            className="bordered"
            style={{ width: 120, height: 120, margin: "0px 24px 12px 0px" }}
          />

          <div style={{ width: 600 }}>
            <Typography>
              {t("Company")}: {job.company}
            </Typography>
            <Typography>
              {t("Workplace")}: {job.workplace}
            </Typography>
            <Typography color="textSecondary">
              {t("Type")}: <span style={{ color: "black" }}>{job.form}</span>
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {t("Salary")}:{" "}
              <span style={{ color: "black" }}>
                {formatCurrency(job.currency, job.fromSalary)}
                {" - "}
                {formatCurrency(job.currency, job.toSalary)}
              </span>
            </Typography>
          </div>
          <div>
            <Typography>
              {t("From")}: {unix(job.createTime).format("DD-MM-YYYY")}
            </Typography>
            <Typography>
              {t("Deadline")}: {unix(job.deadline).format("DD-MM-YYYY")}
            </Typography>
            <Typography color="textSecondary">
              {t("Number of vacancies")}: <span style={{ color: "black" }}>{job.numberOfVacancies}</span>
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {t("Bonus")}: <span style={{ color: job.bonus > 0 ? "green" : "silver" }}>{formatBonus(job.bonus)}</span>
            </Typography>
          </div>
        </div>

        <Divider />
        <Typography variant="h6" color="primary">
          {t("Description")}:
        </Typography>
        <Typography paragraph dangerouslySetInnerHTML={{ __html: decode(job.description) }} />

        <Divider />
        <Typography variant="h6" color="primary">
          {t("Requirement")}:
        </Typography>
        <Typography paragraph dangerouslySetInnerHTML={{ __html: decode(job.requirement) }} />

        <Divider />
        <Typography variant="h6" color="primary">
          {t("Welfare")}:
        </Typography>
        <Typography paragraph dangerouslySetInnerHTML={{ __html: decode(job.welfare) }} />

        <Paper
          elevation={0}
          className="Button-Line"
          style={{ position: "sticky", bottom: 0, margin: -16, padding: 16 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!job.jobDescription}
            onClick={() => window.open(job.jobDescription)}
            startIcon={<OpenInNewIcon />}>
            {t("View JD")}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<PersonAddOutlinedIcon />}
            onClick={() => setIsOpenPopup(true)}>
            {t("Refer candidates")}
          </Button>

          <Link to={privateRoute.jobUpdate.url(id)}>
            <ColorButton variant="contained" color="#388e3c" startIcon={<EditOutlinedIcon />}>
              {t("Edit job")}
            </ColorButton>
          </Link>

          <Dialog fullWidth maxWidth="xl" open={isOpenPopup} onClose={() => setIsOpenPopup(false)}>
            <CandidatePopup job={job} onClose={() => setIsOpenPopup(false)} />
          </Dialog>
        </Paper>
      </Paper>
    </>
  );
};
export default JobView;

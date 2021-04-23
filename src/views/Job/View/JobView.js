import React from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, Button, Dialog, Divider, IconButton, Paper, Typography } from "@material-ui/core";
import {} from "antd";
import { jobService } from "services/job";
import { formatCurrency, formatBonus, normalizeJob } from "utils/converter";
import { t } from "utils/common";
import { unix } from "moment";
import { decode } from "html-entities";
import { privateRoute } from "routes";
import CandidatePopup from "views/Job/CandidatePopup";

import NavigateBeforeOutlinedIcon from "@material-ui/icons/NavigateBeforeOutlined";
import CloudDownloadOutlinedIcon from "@material-ui/icons/CloudDownloadOutlined";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";

const JobView = () => {
  const { id } = useParams();
  const [job, setJob] = React.useState({});

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

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Paper elevation={0} className="align-items-center mb-24" style={{ backgroundColor: "transparent" }}>
        <Link to={privateRoute.job.path}>
          <IconButton>
            <NavigateBeforeOutlinedIcon />
          </IconButton>
        </Link>
        <Typography variant="h6" color="secondary">
          {job.title}
        </Typography>
      </Paper>

      <Paper className="p-16">
        <div className="flex-row">
          <Avatar
            variant="rounded"
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
            <Typography>
              {t("Type")}: {job.form}
            </Typography>
            <Typography variant="subtitle1" style={{ fontWeight: 500 }}>
              {t("Salary")}: {formatCurrency(job.currency, job.fromSalary)}
              {" - "}
              {formatCurrency(job.currency, job.toSalary)}
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
        <Typography dangerouslySetInnerHTML={{ __html: decode(job.description) }} />

        <Divider />
        <Typography variant="h6" color="primary">
          {t("Requirement")}:
        </Typography>
        <Typography dangerouslySetInnerHTML={{ __html: decode(job.requirement) }} />

        <Divider />
        <Typography variant="h6" color="primary">
          {t("Welfare")}:
        </Typography>
        <Typography dangerouslySetInnerHTML={{ __html: decode(job.welfare) }} />

        <Paper elevation={0} style={{ position: "sticky", bottom: 0, margin: -16, padding: 16 }}>
          <Button variant="contained" color="primary" className="mr-12" startIcon={<CloudDownloadOutlinedIcon />}>
            {t("Download JD")}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PersonAddOutlinedIcon />}
            onClick={() => setIsOpenPopup(true)}>
            {t("Refer Candidates")}
          </Button>

          <Dialog fullWidth maxWidth="xl" open={isOpenPopup} onClose={() => setIsOpenPopup(false)}>
            <CandidatePopup job={job} onClose={() => setIsOpenPopup(false)} />
          </Dialog>
        </Paper>
      </Paper>
    </>
  );
};
export default JobView;

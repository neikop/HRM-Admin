import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ColorButton } from "components";
import { Avatar, Button, Dialog, Divider, Paper, Typography } from "@material-ui/core";
import { formatCurrency, formatBonus } from "utils/converter";
import { t } from "utils/common";
import { unix } from "moment";
import { decode } from "html-entities";
import { privateRoute } from "routes";
import CandidatePopup from "views/Job/CandidatePopup";

import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

const Detail = ({ job }) => {
  const { id } = useParams();
  const { isSuper, isAdmin, isCompany } = useSelector(({ profile }) => profile);

  const [isOpenPopup, setIsOpenPopup] = React.useState(false);

  return (
    <Paper className="p-16">
      <div className="flex-row">
        <Avatar
          src={job.avatar}
          style={{ width: 120, height: 120, margin: "0px 24px 12px 0px", backgroundColor: "transparent" }}>
          <Avatar src="/kai_avatar.png" style={{ width: 120, height: 120 }} />
        </Avatar>

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

      <Paper elevation={0} className="Button-Line" style={{ position: "sticky", bottom: 0, margin: -16, padding: 16 }}>
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

        {(isSuper || isAdmin || isCompany) && (
          <Link to={privateRoute.jobUpdate.url(id)}>
            <ColorButton variant="contained" color="#388e3c" startIcon={<EditOutlinedIcon />}>
              {t("Edit job")}
            </ColorButton>
          </Link>
        )}

        <Dialog fullWidth maxWidth="xl" open={isOpenPopup} onClose={() => setIsOpenPopup(false)}>
          <CandidatePopup job={job} onClose={() => setIsOpenPopup(false)} />
        </Dialog>
      </Paper>
    </Paper>
  );
};

export default Detail;

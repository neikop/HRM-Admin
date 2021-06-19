import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ColorButton } from "components";
import { Avatar, Button, Dialog, Divider, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { formatCurrency, formatBonus } from "utils/converter";
import { t } from "utils/common";
import { unix } from "moment";
import { decode } from "html-entities";
import { privateRoute } from "routes";
import { DDMMYYYY } from "utils/constants";
import CandidatePopup from "views/Job/CandidatePopup";

import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

const Detail = ({ job }) => {
  const classes = useStyles();
  const { id } = useParams();
  const { isSuper, isAdmin, isCompany } = useSelector(({ profile }) => profile);

  const [isOpenPopup, setIsOpenPopup] = React.useState(false);

  return (
    <Paper className="p-16 m-4">
      <div className="flex-row flex-wrap">
        <Avatar
          src={job.avatar}
          style={{ width: 120, height: 120, margin: "0px 24px 12px 0px", backgroundColor: "transparent" }}>
          <Avatar src="/kai_avatar.png" style={{ width: 120, height: 120 }} />
        </Avatar>

        <div className="flex-row flex-wrap">
          <div style={{ minWidth: 320, maxWidth: 600, marginBottom: 12, marginRight: 24 }}>
            <Typography>
              {t("Company")}: <Link to={privateRoute.companyDetail.url(job.company?.id)}>{job.company?.name}</Link>
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
          <div style={{ marginBottom: 12 }}>
            <Typography>
              {t("From")}: {unix(job.createTime).format(DDMMYYYY)}
            </Typography>
            <Typography>
              {t("Deadline")}: {unix(job.deadline).format(DDMMYYYY)}
            </Typography>
            <Typography color="textSecondary">
              {t("Number of vacancies")}: <span style={{ color: "black" }}>{job.numberOfVacancies}</span>
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {t("Bonus")}: <span style={{ color: job.bonus > 0 ? "green" : "silver" }}>{formatBonus(job.bonus)}</span>
            </Typography>
          </div>
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

      <Paper elevation={0} className={"Button-Line " + classes.line}>
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
          <Link to={privateRoute.jobUpdate.url(id)} className={classes.link}>
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

const useStyles = makeStyles((theme) => ({
  "@media (max-width: 600px)": {
    line: {
      display: "flex",
      flexDirection: "column",
      height: 120,
      justifyContent: "space-between",
    },
    link: {
      display: "flex",
      flexDirection: "column",
      paddingRight: 12,
    },
  },
}));

export default Detail;

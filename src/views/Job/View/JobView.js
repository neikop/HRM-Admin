import React from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, Button, Dialog, IconButton, Paper, Typography } from "@material-ui/core";
import { jobService } from "services/job";
import { privateRoute } from "routes";
import { decode } from "html-entities";
import { unix } from "moment";
import CandidatePopup from "views/Job/CandidatePopup";

import NavigateBeforeOutlinedIcon from "@material-ui/icons/NavigateBeforeOutlined";

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
          setJob(data);
        }
      });
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
        <Typography variant="h6">{job.title}</Typography>
      </Paper>

      <Paper className="p-16">
        <div className="flex-row">
          <Avatar
            variant="rounded"
            src={job.avatar}
            className="bordered"
            style={{ width: 144, height: 144, margin: "0px 24px 12px 0px" }}
          />

          <div style={{ width: 420 }}>
            <Typography>Ngày đăng: {unix(job.createTime).format("DD-MM-YYYY")}</Typography>
            <Typography>Hạn cuối: {unix(job.deadline).format("DD-MM-YYYY")}</Typography>
            <Typography>Số lượng tuyển: {job.numberOfVacancies} </Typography>
            <Typography>Tiền thưởng: {job.bonus}</Typography>
          </div>
          <div>
            <Typography>Công ty: {job.company} </Typography>
            <Typography>Địa điểm làm việc: {job.workplace} </Typography>
            <Typography>
              Mức lương: {job.fromSalary} - {job.toSalary}
            </Typography>
            <Typography>Hình thức: {job.form}</Typography>
          </div>
        </div>

        <Typography variant="h6" color="primary">
          Description:
        </Typography>
        <Typography dangerouslySetInnerHTML={{ __html: decode(job.description) }} />
        <Typography variant="h6" color="primary">
          Requirement:
        </Typography>
        <Typography dangerouslySetInnerHTML={{ __html: decode(job.requirement) }} />
        <Typography variant="h6" color="primary">
          Welfare:
        </Typography>
        <Typography dangerouslySetInnerHTML={{ __html: decode(job.welfare) }} />

        <Paper elevation={0} style={{ position: "sticky", bottom: 0, margin: -16, padding: 16 }}>
          <Button variant="contained" color="primary" className="mr-12">
            Tải JD
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setIsOpenPopup(true)}>
            Giới thiệu ứng viên
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

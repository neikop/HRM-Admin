import React from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, IconButton, Paper, Typography } from "@material-ui/core";
import { ColorLink } from "components";
import { candidateService } from "services/candidate";
import { privateRoute } from "routes";
import { decode } from "html-entities";
import { unix } from "moment";

import NavigateBeforeOutlinedIcon from "@material-ui/icons/NavigateBeforeOutlined";

const CandidateView = () => {
  const { id } = useParams();
  const [item, setItem] = React.useState({});

  const fetchData = React.useCallback(() => {
    candidateService
      .getInfoCv({
        params_request: { id },
      })
      .then((response) => {
        const { status = 1, data } = response;
        if (status) {
          setItem(data);
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
          <IconButton variant="outlined">
            <NavigateBeforeOutlinedIcon />
          </IconButton>
        </Link>
        <ColorLink variant="h6" onClick={fetchData}>
          Thông tin Ứng viên
        </ColorLink>
      </Paper>

      <Paper className="p-16">
        <div className="flex-row">
          <div style={{ padding: "0px 24px 12px 0px" }}>
            <Avatar variant="rounded" src={item.avatar} className="bordered" style={{ width: 144, height: 144 }} />
          </div>
          <div style={{ width: 420 }}>
            <Typography>Ngày đăng: {unix(item.createTime).format("DD-MM-YYYY")}</Typography>
            <Typography>Hạn cuối: {unix(item.deadline).format("DD-MM-YYYY")}</Typography>
            <Typography>Số lượng tuyển: {item.numberOfVacancies} </Typography>
            <Typography>Tiền thưởng: {item.bonus}</Typography>
          </div>
          <div>
            <Typography>Công ty: {item.company} </Typography>
            <Typography>Địa điểm làm việc: {item.workplace} </Typography>
            <Typography>
              Mức lương: {item.fromSalary} - {item.toSalary}
            </Typography>
            <Typography>Hình thức: {item.form}</Typography>
          </div>
        </div>

        <Typography variant="h6" color="primary">
          Description:
        </Typography>
        <Typography dangerouslySetInnerHTML={{ __html: decode(item.description) }} />
        <Typography variant="h6" color="primary">
          Requirement:
        </Typography>
        <Typography dangerouslySetInnerHTML={{ __html: decode(item.requirement) }} />
        <Typography variant="h6" color="primary">
          Welfare:
        </Typography>
        <Typography dangerouslySetInnerHTML={{ __html: decode(item.welfare) }} />
      </Paper>
    </>
  );
};
export default CandidateView;

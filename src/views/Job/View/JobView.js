import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Alert, ColorButton, Loading } from "components";
import { IconButton, Paper, Typography } from "@material-ui/core";
import { Popconfirm, Tabs, Tag } from "antd";
import { jobService } from "services/job";
import { browserHistory } from "utils/history";
import { normalizeJob } from "utils/converter";
import { t } from "utils/common";
import { privateRoute } from "routes";
import { JOB_STATUS_TYPES } from "utils/constants";
import * as Job from "views/Job/View/Components";

import NavigateBeforeOutlinedIcon from "@material-ui/icons/NavigateBeforeOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

const JobView = () => {
  const { id, active } = useParams();
  const { isSuper, isAdmin, isCompany } = useSelector(({ profile }) => profile);

  const [job, setJob] = React.useState({});
  const [isLoadingDelete, setIsLoadingDelete] = React.useState(false);

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

  const handleChangeActiveKey = (key) => {
    browserHistory.replace(privateRoute.jobView.url(id, key));
  };

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Paper elevation={0} className="align-items-center flex-wrap mb-12" style={{ backgroundColor: "transparent" }}>
        <Link to={privateRoute.jobList.path}>
          <IconButton>
            <NavigateBeforeOutlinedIcon />
          </IconButton>
        </Link>
        <Typography variant="h6">{job.title}</Typography>
        <Tag color={JOB_STATUS_TYPES.find((item) => item.code === job.status)?.color} style={{ marginLeft: 8 }}>
          {JOB_STATUS_TYPES.find((item) => item.code === job.status)?.name}
        </Tag>

        <div className="flex-1" />
        {(isSuper || isAdmin || isCompany) && (
          <Popconfirm placement="topRight" title={t("Are you sure?")} onConfirm={() => handleConfirmDelete()}>
            <ColorButton
              variant="outlined"
              color="#d32f2f"
              style={{ marginLeft: "auto" }}
              startIcon={<Loading visible={isLoadingDelete} icon={<DeleteOutlinedIcon />} />}>
              {t("Delete job")}
            </ColorButton>
          </Popconfirm>
        )}
      </Paper>

      <Tabs destroyInactiveTabPane size="middle" defaultActiveKey={active} onChange={handleChangeActiveKey}>
        <Tabs.TabPane tab={t("Detail")} key="detail">
          <Job.Detail job={job} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t("Referral")} key="referral">
          <Job.Referral job={job} />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default JobView;

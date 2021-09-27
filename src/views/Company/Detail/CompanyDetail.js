import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ColorButton } from "components";
import { Avatar, Divider, Hidden, IconButton, Paper, Typography } from "@material-ui/core";
import { companyService } from "services/company";
import { t } from "utils/common";
import { privateRoute } from "routes";
import { decode } from "html-entities";
import { JobList } from "views/Job/List";

import NavigateBeforeOutlinedIcon from "@material-ui/icons/NavigateBeforeOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

export const CompanyPaper = ({ id, isAdmin }) => {
  const [company, setCompany] = React.useState({});

  const fetchData = React.useCallback(() => {
    if (id)
      companyService
        .getInfoCompany({
          params_request: { id: Number(id) },
        })
        .then((response) => {
          const { status = 1, data } = response;
          if (status) {
            setCompany(data);
          }
        });
  }, [id]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Paper className="p-16">
      <div className="flex-row flex-wrap">
        <Avatar
          src={company.image}
          style={{ width: 120, height: 120, margin: "0px 24px 12px 0px", backgroundColor: "transparent" }}
        />

        <div className="flex-1 mb-12">
          <Link to={privateRoute.companyDetail.url(company.id)}>
            <Typography variant="h6" gutterBottom>
              {company.name}
            </Typography>
          </Link>

          <Typography color="textSecondary">{t("Address")}: </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {company.address}
          </Typography>

          <Typography color="textSecondary">
            {t("Website")}: <a href={company.link}>{company.link}</a>
          </Typography>
        </div>
      </div>

      <Divider />
      <Typography variant="h6" color="primary">
        {t("Description")}:
      </Typography>
      <Typography paragraph dangerouslySetInnerHTML={{ __html: decode(company.description) }} />

      {isAdmin && (
        <Link to={privateRoute.companyUpdate.url(company.id)}>
          <ColorButton variant="contained" color="#388e3c" startIcon={<EditOutlinedIcon />}>
            {t("Edit company")}
          </ColorButton>
        </Link>
      )}
    </Paper>
  );
};

const CompanyDetail = () => {
  const { id } = useParams();
  const { isSuper, isAdmin } = useSelector(({ profile }) => profile);

  return (
    <div className="flex-row align-items-start">
      <div style={{ position: "sticky", top: 84, flex: 1 }}>
        <Paper elevation={0} className="align-items-center mb-24" style={{ backgroundColor: "transparent" }}>
          <Link to={privateRoute.companyList.path}>
            <IconButton>
              <NavigateBeforeOutlinedIcon />
            </IconButton>
          </Link>
          <Typography variant="h6">{t("Company info")}</Typography>
        </Paper>
        <CompanyPaper id={id} isAdmin={isSuper || isAdmin} />
      </div>

      <Hidden mdDown>
        <div style={{ width: 600, marginLeft: 20 }}>
          <JobList showSearch={false} searchParams={{ idCompany: Number(id) }} />
        </div>
      </Hidden>
    </div>
  );
};

export default CompanyDetail;

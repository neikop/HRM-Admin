import React from "react";
import { useSelector } from "react-redux";
import { Button, InputAdornment, MenuItem, Paper, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Col, Row } from "antd";
import { t } from "utils/common";
import {REFERRAL_STATUS_TYPES} from "utils/constants";

import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";

const ReferSearch = ({ onSearch }) => {
  const classes = useStyles();
  const { isUser, isRecruit } = useSelector(({ profile }) => profile);

  const [keyword, setKeyword] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [status, setStatus] = React.useState("");

  const handleClickSearch = () => {
    onSearch({ keyword, company, status });
  };

  const handlePressKey = (event) => {
    if (event.key === "Enter") handleClickSearch();
  };

  return (
    <>
      <Paper elevation={0} className="flex-row mb-24" style={{ backgroundColor: "transparent" }}>
        <TextField
          fullWidth
          label={t("Find your refer by keyword")}
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onKeyPress={handlePressKey}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
          }}
          style={{ marginRight: 12 }}
        />
        <Button variant="contained" color="primary" className={classes.buttonSearch} onClick={handleClickSearch}>
          {t("Search")}
        </Button>
      </Paper>

      <Paper className={"align-items-center flex-wrap p-16 mb-24 " + classes.paperSearch}>
        <div className="flex-row" style={{ minWidth: 160, marginBottom: 12 }}>
          <FilterListOutlinedIcon className="mr-8" />
          <Typography className="mr-24">{t("Filter by")}</Typography>
        </div>

        <Row gutter={[24, 12]} style={{ flex: 1 }}>
         
          <Col xl={6} md={12} span={24}>
            <TextField
              fullWidth
              label={t("Company")}
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />
          </Col>
          <Col xl={6} md={12} span={24}>
            <TextField
              fullWidth
              select
              label={t("Status")}
              value={status}
              onChange={(event) => setStatus(event.target.value)}>
              {REFERRAL_STATUS_TYPES.filter((item) => !item.noFilter || !(isUser || isRecruit)).map((item) => (
                <MenuItem key={item.id} value={item.code}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Col>
        </Row>
      </Paper>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paperSearch: {
    "@media (max-width: 800px)": {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  buttonSearch: {
    "@media (min-width: 600px)": {
      width: 420,
    },
  },
}));

export default ReferSearch;
import React from "react";
import { NumberFormat } from "components";
import { Button, InputAdornment, MenuItem, Paper, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Col, Row } from "antd";
import { t } from "utils/common";
import { CURRENCY_TYPES, JOB_STATUS_TYPES, WORKPLACE_TYPES } from "utils/constants";

import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";

const JobSearch = ({ onSearch }) => {
  const classes = useStyles();

  const [keyword, setKeyword] = React.useState("");
  const [workplace, setWorkplace] = React.useState("");
  const [salary, setSalary] = React.useState(0);
  const [currency, setCurrency] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [status, setStatus] = React.useState("");

  const handleClickSearch = () => {
    onSearch({ keyword, workplace, salary, currency, company, status });
  };

  const handlePressKey = (event) => {
    if (event.key === "Enter") handleClickSearch();
  };

  return (
    <>
      <Paper elevation={0} className="flex-row mb-24" style={{ backgroundColor: "transparent" }}>
        <TextField
          fullWidth
          label={t("Find your job by keyword")}
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
              select
              label={t("Workplace")}
              value={workplace}
              onChange={(event) => setWorkplace(event.target.value)}>
              {WORKPLACE_TYPES.map((item) => (
                <MenuItem key={item.id} value={item.code}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Col>
          <Col xl={6} md={12} span={24}>
            <TextField
              fullWidth
              label={t("Salary")}
              value={salary}
              onChange={(event) => setSalary(event.target.value)}
              InputProps={{
                inputComponent: NumberFormat,
                startAdornment: <InputAdornment position="start">≥</InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <TextField
                      select
                      variant="standard"
                      value={currency}
                      onChange={(event) => setCurrency(event.target.value)}>
                      {CURRENCY_TYPES.map((item) => (
                        <MenuItem key={item.id} value={item.code}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </InputAdornment>
                ),
              }}
            />
          </Col>
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
              {JOB_STATUS_TYPES.map((item) => (
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

export default JobSearch;

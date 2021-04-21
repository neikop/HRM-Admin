import React from "react";
import { NumberFormat } from "components";
import { Button, InputAdornment, MenuItem, Paper, TextField, Typography } from "@material-ui/core";
import { t } from "utils/common";

import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";

export const WORKPLACE_TYPES = [
  { id: 1, code: "Hà Nội", name: "Ha Noi" },
  { id: 2, code: "Đà Nẵng", name: "Da Nang" },
  { id: 3, code: "Hồ Chí Minh", name: "Ho Chi Minh" },
];

export const CURRENCY_TYPES = [
  { id: 1, code: "VND", name: "Đ" },
  { id: 2, code: "USD", name: "$" },
  { id: 3, code: "JPY", name: "¥" },
];

export const JOB_STATUS_TYPES = [
  { id: 1, code: 1, name: t("Active") },
  { id: 2, code: 0, name: t("Close") },
];

const JobSearch = ({ onSearch }) => {
  const [keyword, setKeyword] = React.useState("");
  const [workplace, setWorkplace] = React.useState("");
  const [salary, setSalary] = React.useState(0);
  const [currency, setCurrency] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [status, setStatus] = React.useState("");

  const handleClickSearch = () => {
    onSearch({ keyword, workplace, salary, currency, company, status });
  };

  return (
    <>
      <Paper elevation={0} className="flex-row mb-24" style={{ backgroundColor: "transparent" }}>
        <TextField
          fullWidth
          label={t("Find your job by keyword")}
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
          }}
          style={{ marginRight: 12 }}
        />
        <Button variant="contained" color="primary" style={{ width: 420 }} onClick={handleClickSearch}>
          {t("Search")}
        </Button>
      </Paper>

      <Paper className="align-items-center p-16 mb-24">
        <FilterListOutlinedIcon className="mr-8" />
        <Typography className="mr-24">{t("Filter by")}</Typography>

        <TextField
          select
          label={t("Workplace")}
          value={workplace}
          onChange={(event) => setWorkplace(event.target.value)}
          style={{ width: 240, marginRight: 24 }}>
          {WORKPLACE_TYPES.map((item) => (
            <MenuItem key={item.id} value={item.code}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
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
          style={{ width: 240, marginRight: 24 }}
        />

        <TextField
          select
          label={t("Company")}
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          style={{ width: 240, marginRight: 24 }}>
          {[].map((item) => (
            <MenuItem key={item.id} value={item.code}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label={t("Status")}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          style={{ width: 240 }}>
          {JOB_STATUS_TYPES.map((item) => (
            <MenuItem key={item.id} value={item.code}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
      </Paper>
    </>
  );
};

export default JobSearch;

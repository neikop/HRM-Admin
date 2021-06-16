import React from "react";
import { Button, InputAdornment, Paper, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { t } from "utils/common";

import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

const CompanySearch = ({ onSearch }) => {
  const classes = useStyles();
  const [keyword, setKeyword] = React.useState("");

  const handleClickSearch = () => {
    onSearch({ keyword });
  };

  return (
    <>
      <Paper elevation={0} className="flex-row mb-24" style={{ backgroundColor: "transparent" }}>
        <TextField
          fullWidth
          label={t("Find company by keyword")}
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
        <Button variant="contained" color="primary" className={classes.buttonSearch} onClick={handleClickSearch}>
          {t("Search")}
        </Button>
      </Paper>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  buttonSearch: {
    "@media (min-width: 600px)": {
      width: 420,
    },
  },
}));

export default CompanySearch;

import React from "react";
import { Button, InputAdornment, Paper, TextField } from "@material-ui/core";
import { t } from "utils/common";

import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

const CandidateSearch = ({ onSearch }) => {
  const [keyword, setKeyword] = React.useState("");

  const handleClickSearch = () => {
    onSearch({ keyword });
  };

  return (
    <>
      <Paper elevation={0} className="flex-row mb-24" style={{ backgroundColor: "transparent" }}>
        <TextField
          fullWidth
          label={t("Find candidate by keyword")}
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
    </>
  );
};

export default CandidateSearch;

import React from "react";
import { Button, InputAdornment, MenuItem, Paper, TextField, Typography } from "@material-ui/core";

import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";

const KHU_VUC = [
  { id: 1, code: "Hà Nội", name: "Hà Nội" },
  { id: 2, code: "Hồ Chí Minh", name: "Hồ Chí Minh" },
  { id: 3, code: "Đà Nẵng", name: "Đà Nẵng" },
];

const DON_VI = [
  { id: 1, code: "VND", name: "Đ" },
  { id: 3, code: "USD", name: "$" },
];

const JobSearch = () => {
  return (
    <>
      <Paper elevation={0} className="flex-row mb-24" style={{ backgroundColor: "transparent" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Tìm công việc theo từ khóa"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
          }}
          style={{ marginRight: 12 }}
        />
        <Button variant="contained" color="primary" style={{ width: 420 }}>
          Tìm kiếm
        </Button>
      </Paper>

      <Paper className="align-items-center p-16 mb-24">
        <FilterListOutlinedIcon />
        <Typography style={{ marginRight: 24 }}>Lọc theo</Typography>

        <TextField select variant="outlined" label="Khu vực" style={{ width: 240, marginRight: 24 }}>
          {KHU_VUC.map((item) => (
            <MenuItem key={item.id} value={item.code}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          variant="outlined"
          label="Mức lương"
          InputProps={{
            startAdornment: <InputAdornment position="start">≥</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <TextField select defaultValue={DON_VI[0].code}>
                  {DON_VI.map((item) => (
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

        <TextField select variant="outlined" label="Công ty" style={{ width: 240, marginRight: 24 }}>
          {KHU_VUC.map((item) => (
            <MenuItem key={item.id} value={item.code}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField select variant="outlined" label="Trạng thái" style={{ width: 240 }}>
          {KHU_VUC.map((item) => (
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

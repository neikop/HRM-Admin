import React from "react";
import { Link } from "react-router-dom";
import { Button, Paper, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { browserHistory } from "utils/history";
import { privateRoute } from "routes";

const LoginForm = () => {
  const classes = useStyles();

  const handleClickLogin = () => {
    browserHistory.replace(privateRoute.home.path);
  };

  return (
    <Paper>
      <Typography variant="h5" className={classes.header}>
        Login
      </Typography>
      <TextField variant="outlined" label="Username" className={classes.input}></TextField>
      <TextField type="password" variant="outlined" label="Password" className={classes.input}></TextField>
      <Typography component={Link} to="#" className={classes.link} style={{ alignSelf: "flex-end" }}>
        Forgot password?
      </Typography>
      <Button variant="contained" color="primary" className={classes.button} onClick={handleClickLogin}>
        Login
      </Button>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    alignSelf: "center",
    marginBottom: theme.spacing(4),
  },
  input: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  link: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.dark,
    },
  },
}));

export default LoginForm;

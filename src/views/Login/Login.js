import React from "react";
import { Link } from "react-router-dom";
import { Alert, Loading } from "components";
import { Button, Paper, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { profileAction } from "actions/profile";
import { userService } from "services/user";
import { t } from "utils/common";
import { authRoute } from "routes";

const LoginForm = () => {
  const classes = useStyles();

  const [username, setUsername] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  const validateUsername = (value) => {
    if (value.trim() === "") {
      return "Username cannot be empty";
    }
    return "";
  };

  const handleChangeUsername = (event) => {
    const { value } = event.target;
    setUsername(value);
    setUsernameError(validateUsername(value));
  };

  const validatePassword = (value) => {
    if (value.trim() === "") {
      return "Password cannot be empty";
    }
    return "";
  };

  const handleChangePassword = (event) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleClickSubmit = () => {
    const usernameError = validateUsername(username);
    setUsernameError(usernameError);
    const passwordError = validatePassword(password);
    setPasswordError(passwordError);
    if (usernameError || passwordError) return;

    setIsLoading(true);
    const body = { username, password };
    userService
      .login(body)
      .then(({ status = 1, data }) => {
        if (status) {
          Alert.success({ message: t("Welcome"), placement: "topRight", top: 72 });

          profileAction.login(data);
        }
      })
      .catch(console.warn)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePressKey = (event) => {
    if (event.key === "Enter") handleClickSubmit();
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h5" className={classes.header}>
        {t("Log in")}
      </Typography>
      <TextField
        label={t("Username")}
        className={classes.input}
        value={username}
        error={Boolean(usernameError)}
        onChange={handleChangeUsername}
        onKeyPress={handlePressKey}
      />
      <TextField
        type="password"
        label={t("Password")}
        className={classes.input}
        value={password}
        error={Boolean(passwordError)}
        onChange={handleChangePassword}
        onKeyPress={handlePressKey}
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<Loading visible={isLoading} />}
        onClick={handleClickSubmit}>
        {t("Log in")}
      </Button>

      <Typography className={classes.link}>
        {t(`Don't have account?`)} <Link to={authRoute.register.path}>{t("Sign up")}</Link>
      </Typography>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    alignSelf: "center",
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: 24,
    width: 420,
    display: "flex",
    flexDirection: "column",
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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default LoginForm;

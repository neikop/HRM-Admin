import React from "react";
import { Button, Paper, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { profileAction } from "actions/profile";
import { userService } from "services/user";
import { Loading } from "components";

const LoginForm = () => {
  const classes = useStyles();

  const [username, setUsername] = React.useState("admin123");
  const [usernameError, setUsernameError] = React.useState("");
  const [password, setPassword] = React.useState("admin12366949");
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
          profileAction.login(data);
          localStorage.setItem("hrm.admin.user", JSON.stringify(data));
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePressKey = (event) => {
    if (event.key === "Enter") handleClickSubmit();
  };

  return (
    <Paper>
      <Typography variant="h5" className={classes.header}>
        Login
      </Typography>
      <TextField
        label="Username"
        className={classes.input}
        value={username}
        error={Boolean(usernameError)}
        onChange={handleChangeUsername}
        onKeyPress={handlePressKey}
      />
      <TextField
        type="password"
        label="Password"
        className={classes.input}
        value={password}
        error={Boolean(passwordError)}
        onChange={handleChangePassword}
        onKeyPress={handlePressKey}
      />
      <Button variant="contained" color="primary" className={classes.button} onClick={handleClickSubmit}>
        <Loading visible={isLoading} /> Login
      </Button>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    alignSelf: "center",
    marginBottom: theme.spacing(2),
  },
  input: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default LoginForm;

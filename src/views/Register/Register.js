import React from "react";
import { Link } from "react-router-dom";
import { Alert, Loading } from "components";
import { Button, Paper, Tab, Tabs, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { profileAction } from "actions/profile";
import { userService } from "services/user";
import { validator } from "utils/validator";
import { t } from "utils/common";
import { authRoute } from "routes";

const RegisterForm = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = React.useState(0);

  const [username, setUsername] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");

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

  const validateEmail = (value) => {
    if (value.trim() === "") {
      return "Email cannot be empty";
    }
    if (!validator.isValidEmail(value)) {
      return "Email is not valid";
    }
    return "";
  };

  const handleChangeEmail = (event) => {
    const { value } = event.target;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const validatePhone = (value) => {
    if (value.trim() === "") {
      return "";
    }
    if (!validator.isValidPhone(value)) {
      return "Phone number is not valid";
    }
    return "";
  };

  const handleChangePhone = (event) => {
    const { value } = event.target;
    setPhone(value);
    setPhoneError(validatePhone(value));
  };

  const handleClickSubmit = () => {
    const usernameError = validateUsername(username);
    setUsernameError(usernameError);
    const passwordError = validatePassword(password);
    setPasswordError(passwordError);
    const emailError = validateEmail(email);
    setEmailError(emailError);
    const phoneError = validatePhone(phone);
    setPhoneError(phoneError);
    if (usernameError || passwordError || emailError || phoneError) return;

    setIsLoading(true);
    const body = {
      username,
      password,
      email,
      phone,
      userType: activeTab,
    };
    userService
      .signup(body)
      .then(({ status = 1 }) => {
        if (status) {
          Alert.success({ message: t("Sign up successfully"), placement: "topRight", top: 72 });

          return userService.login({ username, password });
        }
      })
      .then(({ status = 1, data }) => {
        if (status) {
          profileAction.login(data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePressKey = (event) => {
    if (event.key === "Enter") handleClickSubmit();
  };

  return (
    <Paper className={classes.paper}>
      <Tabs variant="fullWidth" indicatorColor="primary" value={activeTab} onChange={(_, value) => setActiveTab(value)}>
        <Tab label="Recruiter" />
        <Tab label="Company" />
      </Tabs>

      <Typography variant="h5" className={classes.header}>
        {t("Sign up")}
      </Typography>
      <Typography color="textSecondary" className={classes.title}>
        {activeTab ? t("Sign up as employer") : t("Sign up as freelance hunter")}
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

      <TextField
        label={t("Email")}
        className={classes.input}
        value={email}
        error={Boolean(emailError)}
        onChange={handleChangeEmail}
        onKeyPress={handlePressKey}
      />
      <TextField
        label={t("Phone number")}
        className={classes.input}
        value={phone}
        error={Boolean(phoneError)}
        onChange={handleChangePhone}
        onKeyPress={handlePressKey}
      />

      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<Loading visible={isLoading} />}
        onClick={handleClickSubmit}>
        {t("Sign up")}
      </Button>

      <Typography className={classes.link}>
        {t(`Already have an account?`)} <Link to={authRoute.login.path}>{t("Log in")}</Link>
      </Typography>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    alignSelf: "center",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  title: {
    alignSelf: "center",
    marginBottom: theme.spacing(2),
    textTransform: "uppercase",
  },
  paper: {
    padding: 24,
    width: 420,
    display: "inline-flex",
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

export default RegisterForm;

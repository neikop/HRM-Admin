import React from "react";
import { Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { browserHistory } from "utils/history";

const CustomLink = ({ to, onClick, children, ...props }) => {
  const classes = useStyles();

  const handleClick = (event) => {
    event.preventDefault();
    if (typeof onClick === "function") {
      onClick(event);
    } else if (to) {
      browserHistory.push(to);
    }
  };

  return (
    <Link component={Typography} onClick={handleClick} underline="none" className={classes.link} {...props}>
      {children ?? ""}
    </Link>
  );
};

const useStyles = makeStyles((theme) => ({
  link: {
    cursor: "pointer",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.dark,
    },
  },
}));

export default CustomLink;

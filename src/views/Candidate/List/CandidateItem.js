import { Paper, Avatar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { unix } from "moment";
import { DDMMYYYY } from "utils/constants";

import CallOutlinedIcon from "@material-ui/icons/CallOutlined";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import CakeOutlinedIcon from "@material-ui/icons/CakeOutlined";
import AvTimerOutlinedIcon from "@material-ui/icons/AvTimerOutlined";
import CardMembershipOutlinedIcon from "@material-ui/icons/CardMembershipOutlined";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";

const CandidateItem = ({ candidate }) => {
  const classes = useStyles();

  return (
    <Paper className="justify-content-start p-12">
      <Avatar src={candidate.avatar} style={{ width: 72, height: 72, marginRight: 12 }} />
      <div style={{ marginRight: 40 }}>
        <Typography className={classes.line}>
          <CallOutlinedIcon className={classes.icon} />
          {candidate.phone}
        </Typography>
        <Typography className={classes.line}>
          <EmailOutlinedIcon className={classes.icon} />
          {candidate.email}
        </Typography>
        <Typography className={classes.line}>
          <CakeOutlinedIcon className={classes.icon} />
          {candidate.dayOfBirth ? unix(candidate.dayOfBirth / 1000).format(DDMMYYYY) : "-"}
        </Typography>
      </div>
      <div>
        <Typography className={classes.line}>
          <AvTimerOutlinedIcon className={classes.icon} />
          {candidate.position || "-"}
        </Typography>
        <Typography className={classes.line}>
          <CardMembershipOutlinedIcon className={classes.icon} />
          {candidate.skill || "-"}
        </Typography>
        <Typography className={classes.line}>
          <LocationOnOutlinedIcon className={classes.icon} />
          {candidate.address || "-"}
        </Typography>
      </div>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  line: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    width: 40,
  },
}));

export default CandidateItem;

import { Paper, Avatar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { unix } from "moment";
import { DDMMYYYY } from "utils/constants";

import CallOutlinedIcon from "@material-ui/icons/CallOutlined";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import CakeOutlinedIcon from "@material-ui/icons/CakeOutlined";
import Language from "@material-ui/icons/Language";
import CardMembershipOutlinedIcon from "@material-ui/icons/CardMembershipOutlined";
import Stars from "@material-ui/icons/Stars";

const DetailRefer = ({ refer }) => {
  const classes = useStyles();

  return (
    <Paper className="justify-content-start p-12">
      <Avatar src={refer.candidateAvatar} style={{ width: 72, height: 72, marginRight: 12 }} />
      
      <div style={{ marginRight: 40 }}>
        <Typography className={classes.line}>
          <CallOutlinedIcon className={classes.icon} />
          {refer.candidatePhone}
        </Typography>
        <Typography className={classes.line}>
          <EmailOutlinedIcon className={classes.icon} />
          {refer.candidateEmail}
        </Typography>
        <Typography className={classes.line}>
          <CakeOutlinedIcon className={classes.icon} />
          {refer.candidateDayOfBirth ? unix(refer.candidateDayOfBirth).format(DDMMYYYY) : "-"}
        </Typography>
      </div>
      
      <div>

        <Typography className={classes.line}>
          <Language className={classes.icon} />
          {refer.candidateLanguage || "-"}
        </Typography>

        <Typography className={classes.line}>
          <CardMembershipOutlinedIcon className={classes.icon} />
          {refer.candidateSkill || "-"}
        </Typography>
        
        <Typography className={classes.line}>
          <Stars className={classes.icon} />
          {refer.candidateLevel || "-"}
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

export default DetailRefer;

import { Paper, Avatar } from "@material-ui/core";

const CandidateItem = ({ candidate }) => {
  return (
    <Paper className="p-12">
      <Avatar src={candidate.avatar} />
    </Paper>
  );
};

export default CandidateItem;

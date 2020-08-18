import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Totales({ title, amount }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {title}
      </Typography>
      <Typography component="p" variant="h4">
        {amount}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {`Hasta hoy, ${moment().format("MMMM Do YYYY")}`}
      </Typography>
    </React.Fragment>
  );
}

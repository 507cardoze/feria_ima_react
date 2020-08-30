import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import "./cuadroTotales.styles.scss";

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Totales({ title, amount, body, letraGrande, gigante }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      {!gigante ? (
        <>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {title}
          </Typography>
          <Typography component="p" variant={!letraGrande ? "h4" : "h1"}>
            {amount}
          </Typography>
          <Typography color="textSecondary" className={classes.depositContext}>
            {body}
          </Typography>
        </>
      ) : (
        <>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {title}
          </Typography>
          <Typography
            component="p"
            id="gigante"
            variant={!letraGrande ? "h4" : "h1"}
          >
            {amount}
          </Typography>
          <Typography color="textSecondary" className={classes.depositContext}>
            {body}
          </Typography>
        </>
      )}
    </React.Fragment>
  );
}

import React from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

function Inventario() {
  const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },
    fixedHeight: {
      height: 240,
    },
  }));
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <MainLayout Tittle="Inventario">
      <Grid item xs={12} md={12} lg={12}>
        <div className="header-buttons">
          <Button variant="contained" color="primary" className="button-input">
            <Link to="/inventario-ajuste">Inventario Ajuste</Link>
          </Button>
          <Button variant="contained" color="primary" className="button-input">
            <Link to="/tipo-ajustes">Tipo Ajuste</Link>
          </Button>
        </div>
      </Grid>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}></Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}></Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper className={classes.paper}></Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
}

export default Inventario;

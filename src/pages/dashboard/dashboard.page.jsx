import React, { useState, useEffect, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Totales from "../../components/cuadroTotales/cuadroTotales.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import GraficaConsumo from "../../components/graficaBar/graficaBar.component";
import CircularProgress from "@material-ui/core/CircularProgress";

function Dashboard() {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);

  const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },
    fixedHeight: {
      height: "auto",
    },
  }));
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const UnauthorizedRedirect = (data) => {
    if (data === "No esta autorizado") {
      localStorage.clear();
      window.location.replace("/login");
    }
  };

  const [ferias, setFerias] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const url = `${process.env.REACT_APP_BACK_END}/api/consultas/total-ferias`;
  const urlCantidad = `${process.env.REACT_APP_BACK_END}/api/consultas/total-transacciones`;

  useEffect(() => {
    const header = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token_key}`,
      },
      mode: "cors",
      cache: "default",
    };

    const fetchdata = async (url, header, setter) => {
      setisLoading(false);
      try {
        const data = await fetch(url, header);
        const filtered = await data.json();
        UnauthorizedRedirect(filtered);
        setter(filtered);
        setisLoading(true);
      } catch (error) {
        msgError(error);
      }
    };
    fetchdata(url, header, setFerias);
    fetchdata(urlCantidad, header, setCantidad);
  }, [url, urlCantidad]);

  return (
    <MainLayout Tittle="Dashboard">
      {!isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper className={fixedHeightPaper}>
              {ferias.length > 0 && (
                <GraficaConsumo
                  ferias={ferias}
                  etiqueta="Total de transacciones"
                />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper className={fixedHeightPaper}>
              <Totales title={"Total de Transacciones"} amount={cantidad} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </MainLayout>
  );
}

export default memo(Dashboard);

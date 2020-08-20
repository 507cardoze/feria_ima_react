import React, { useState, useEffect, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Totales from "../../components/cuadroTotales/cuadroTotales.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import GraficaConsumo from "../../components/graficaBar/graficaBar.component";
import GraficaClientes from "../../components/graficaBar/graficaBarClientes.component";
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
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "center",
      maxHeight: 450,
      width: "100%",
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

  const [clientes, setClientes] = useState([]);
  const [cantidadClientes, setCantidadClientes] = useState([]);

  const [isLoading, setisLoading] = useState(true);

  const url = `${process.env.REACT_APP_BACK_END}/api/consultas/total-ferias`;
  const urlCantidad = `${process.env.REACT_APP_BACK_END}/api/consultas/total-transacciones`;

  const urlClientes = `${process.env.REACT_APP_BACK_END}/api/consultas/total-clientes`;
  const urlCantidadClientes = `${process.env.REACT_APP_BACK_END}/api/consultas/cantidad-clientes`;

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
        msgError(`No hay conexion... ${error}`);
      }
    };
    fetchdata(url, header, setFerias);
    fetchdata(urlCantidad, header, setCantidad);
    fetchdata(urlClientes, header, setClientes);
    fetchdata(urlCantidadClientes, header, setCantidadClientes);
  }, [url, urlCantidad, urlClientes, urlCantidadClientes]);

  return (
    <MainLayout Tittle="Dashboard">
      {!isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Paper className={fixedHeightPaper}>
              {ferias.length > 0 && (
                <GraficaConsumo ferias={ferias} etiqueta="Total de Consumo" />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper className={fixedHeightPaper}>
              <Totales
                title={"Total de Consumo por ferias"}
                amount={cantidad}
                body={`Hasta hoy`}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <Paper className={fixedHeightPaper}>
              {clientes.length > 0 && (
                <GraficaClientes
                  clientes={clientes}
                  etiqueta="Total de clientes"
                />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper className={fixedHeightPaper}>
              <Totales
                title={"Total de clientes por ferias"}
                amount={cantidadClientes}
                body={`Hasta hoy`}
              />
            </Paper>
          </Grid>
        </Grid>
      )}
    </MainLayout>
  );
}

export default memo(Dashboard);

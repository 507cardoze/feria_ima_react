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
      justifyContent: "space-around",
      maxHeight: 250,
      width: "100%",
    },
    fixedHeight: {
      height: "100vw",
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

  const [feriasHoy, setFeriasHoy] = useState([]);
  const [clientesHoy, setClientesHoy] = useState([]);

  const url = `${process.env.REACT_APP_BACK_END}/api/consultas/total-ferias`;
  const urlCantidad = `${process.env.REACT_APP_BACK_END}/api/consultas/total-transacciones`;

  const urlClientes = `${process.env.REACT_APP_BACK_END}/api/consultas/total-clientes`;
  const urlCantidadClientes = `${process.env.REACT_APP_BACK_END}/api/consultas/cantidad-clientes`;

  const urlFeriasHoy = `${process.env.REACT_APP_BACK_END}/api/consultas/total-ferias-hoy`;
  const urlClientesHoy = `${process.env.REACT_APP_BACK_END}/api/consultas/total-clientes-hoy`;

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

    fetchdata(urlFeriasHoy, header, setFeriasHoy);
    fetchdata(urlClientesHoy, header, setClientesHoy);
  }, [
    url,
    urlCantidad,
    urlClientes,
    urlCantidadClientes,
    urlFeriasHoy,
    urlClientesHoy,
  ]);

  return (
    <MainLayout Tittle="Dashboard">
      {!isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={5} lg={5}>
            {feriasHoy.length > 0 && (
              <Paper className={fixedHeightPaper}>
                <GraficaConsumo ferias={feriasHoy} etiqueta="Consumo de hoy" />
              </Paper>
            )}
          </Grid>
          <Grid item xs={12} md={5} lg={5}>
            {ferias.length > 0 && (
              <Paper className={fixedHeightPaper}>
                <GraficaConsumo ferias={ferias} etiqueta="Total de Consumo" />
              </Paper>
            )}
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            {cantidad.length > 0 && (
              <Paper className={fixedHeightPaper}>
                <Totales
                  title={"Total de Consumo por ferias en el sistema"}
                  amount={cantidad}
                  body={`Hasta hoy`}
                />
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={5} lg={5}>
            {clientesHoy.length > 0 && (
              <Paper className={fixedHeightPaper}>
                <GraficaClientes
                  clientes={clientesHoy}
                  etiqueta="Total de clientes hoy"
                />
              </Paper>
            )}
          </Grid>
          <Grid item xs={12} md={5} lg={5}>
            {clientes.length > 0 && (
              <Paper className={fixedHeightPaper}>
                <GraficaClientes
                  clientes={clientes}
                  etiqueta="Total de clientes"
                />
              </Paper>
            )}
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            {cantidadClientes.length > 0 && (
              <Paper className={fixedHeightPaper}>
                <Totales
                  title={"Total de clientes en el sistema"}
                  amount={cantidadClientes}
                  body={`Hasta hoy`}
                />
              </Paper>
            )}
          </Grid>
        </Grid>
      )}
    </MainLayout>
  );
}

export default memo(Dashboard);

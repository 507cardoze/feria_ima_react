import React, { useState, useEffect, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import GraficaConsumo from "../../components/graficaBar/graficaBar.component";
import CircularProgress from "@material-ui/core/CircularProgress";
import { toast } from "react-toastify";
import Totales from "../../components/cuadroTotales/cuadroTotales.component";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import moment from "moment";
import "./consultas.styles.scss";

function Consultas() {
  const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },
    paper_1: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "row",
    },
    fixedHeight: {
      height: "auto",
    },
  }));
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fixedHeightPaper1 = clsx(classes.paper_1, classes.fixedHeight);

  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);

  const UnauthorizedRedirect = (data) => {
    if (data === "No esta autorizado") {
      localStorage.clear();
      window.location.replace("/login");
    }
  };

  const [ferias, setFerias] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  console.log(moment(desde).format("YYYY-MM-DD hh:mm:ss"));
  console.log(moment(hasta).format("YYYY-MM-DD hh:mm:ss"));

  const url = `${process.env.REACT_APP_BACK_END}/api/consultas/total-ferias`;
  const urlCantidad = `${process.env.REACT_APP_BACK_END}/api/consultas/total-transacciones`;

  const header = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token_key}`,
    },
    mode: "cors",
    cache: "default",
  };

  const onChangeSetter = (e, setter) => {
    setter(e.target.value);
  };

  const onClickBuscar = (e) => {
    console.log("click...");
    e.preventDefault();
    fetchdata(
      `${url}?desde=${moment(desde).format("YYYY-MM-DD")}&hasta=${moment(
        hasta
      ).format("YYYY-MM-DD")}`,
      header,
      setFerias
    );
    fetchdata(
      `${urlCantidad}?desde=${moment(desde).format(
        "YYYY-MM-DD"
      )}&hasta=${moment(hasta).format("YYYY-MM-DD")}`,
      header,
      setCantidad
    );
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

  return (
    <MainLayout Tittle="Consultas">
      <Grid item xs={12}>
        <Paper className={fixedHeightPaper}>
          <Grid item xs={12} md={12} lg={12}>
            <div className="select-form">
              <InputLabel id="desde-label">Desde</InputLabel>
              <TextField
                labelId="desde-label"
                variant="outlined"
                defaultValue={desde}
                className="inputs"
                type="date"
                onChange={(e) => onChangeSetter(e, setDesde)}
              />
            </div>
            <div className="select-form">
              <InputLabel id="hasta-label">Hasta</InputLabel>
              <TextField
                labelId="hasta-label"
                variant="outlined"
                defaultValue={hasta}
                className="inputs"
                type="date"
                onChange={(e) => onChangeSetter(e, setHasta)}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            {desde.length > 0 && hasta.length > 0 ? (
              <Button
                className="inputs"
                variant="contained"
                color="primary"
                onClick={onClickBuscar}
              >
                Buscar
              </Button>
            ) : (
              ""
            )}
          </Grid>
        </Paper>
      </Grid>
      {ferias.length > 0 && (
        <div className="grafica-consulta" container spacing={3}>
          <Grid item xs={8} md={8} lg={8}>
            <Paper className="grafica-space">
              {ferias.length > 0 && (
                <GraficaConsumo
                  ferias={ferias}
                  etiqueta="Total de transacciones"
                />
              )}
            </Paper>
          </Grid>
          <Grid item xs={8} md={4} lg={3}>
            <Paper className="grafica-space">
              <Totales title={"Total de Transacciones"} amount={cantidad} />
            </Paper>
          </Grid>
        </div>
      )}
    </MainLayout>
  );
}

export default Consultas;

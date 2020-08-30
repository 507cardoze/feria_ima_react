import React, { useState, useEffect, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import GraficaConsumo from "../../components/graficaBar/graficaBar.component";
import { toast } from "react-toastify";
import Totales from "../../components/cuadroTotales/cuadroTotales.component";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import moment from "moment";
import "./consultas.styles.scss";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import "moment/locale/es.js";

function ConsultasConsumo() {
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

  const [feriasSelect, setFeriasSelect] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  // input 1
  const [ferias, setFerias] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  const [desde, setDesde] = useState(moment().format().toString().slice(0, 10));
  const [hasta, setHasta] = useState(moment().format().toString().slice(0, 10));

  //input 2
  const [feriasUnica, setFeriasUnica] = useState([]);
  const [id_feria, setIdFeria] = useState(999);

  const url = `${process.env.REACT_APP_BACK_END}/api/consultas/total-ferias`;
  const urlCantidad = `${process.env.REACT_APP_BACK_END}/api/consultas/total-transacciones`;
  const urlFeriaByFechabyId = `${process.env.REACT_APP_BACK_END}/api/consultas/feria/`;

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

  const onClickBuscarFeria = (e) => {
    setFerias([]);
    setCantidad([]);
    setFeriasUnica([]);
    e.preventDefault();
    if (id_feria === 999) {
      fetchdata(`${url}?desde=${desde}&hasta=${hasta}`, header, setFerias);
      fetchdata(
        `${urlCantidad}?desde=${desde}&hasta=${hasta}`,
        header,
        setCantidad
      );
    } else {
      fetchdata(
        `${urlFeriaByFechabyId}${id_feria}?desde=${desde}&hasta=${hasta}`,
        header,
        setFeriasUnica
      );
    }
  };

  const fetchdata = async (url, header, setter) => {
    setisLoading(false);
    try {
      const data = await fetch(url, header);
      const filtered = await data.json();
      UnauthorizedRedirect(filtered);
      if (filtered.length === 0) {
        msgError("No hay registros.");
      }
      setter(filtered);
      setisLoading(true);
    } catch (error) {
      msgError(error);
    }
  };

  useEffect(() => {
    const urlFeria = `${process.env.REACT_APP_BACK_END}/api/feria/filtrada`;
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
        if (filtered.length === 0) {
          msgError("No hay registros.");
        }
        setter(filtered);
        setisLoading(true);
      } catch (error) {
        msgError(`No hay conexion... ${error}`);
      }
    };
    fetchdata(urlFeria, header, setFeriasSelect);
  }, []);

  return (
    <MainLayout Tittle="Por Consumos">
      {!isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Paper item xs={12} className="grid-principal-inputs">
            <div className="consultas-por-feria-select">
              <Grid item xs={12} md={12} lg={12}>
                <div className="select-form">
                  <Typography
                    component="h2"
                    variant="h6"
                    color="primary"
                    gutterBottom
                  >
                    Consumo por feria
                  </Typography>
                  <div className="select-form">
                    <InputLabel id="ferias-select-label">Ferias</InputLabel>
                    <Select
                      labelId="ferias-select-label"
                      id="ferias-simple-select"
                      className="inputs"
                      onChange={(e) => onChangeSetter(e, setIdFeria)}
                      autoWidth
                      value={id_feria}
                    >
                      <MenuItem value={999}>Todas</MenuItem>
                      {feriasSelect.map((pa) => {
                        return (
                          <MenuItem key={pa.id_feria} value={pa.id_feria}>
                            {pa.nombre_feria}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                  <InputLabel id="desde-label">Desde</InputLabel>
                  <TextField
                    labelId="desde-label"
                    variant="outlined"
                    value={desde}
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
                    value={hasta}
                    className="inputs"
                    type="date"
                    onChange={(e) => onChangeSetter(e, setHasta)}
                  />
                </div>
                {desde.length > 0 && hasta.length && id_feria ? (
                  <Button
                    className="inputs"
                    variant="contained"
                    color="primary"
                    onClick={onClickBuscarFeria}
                  >
                    Buscar
                  </Button>
                ) : (
                  ""
                )}
              </Grid>
            </div>
          </Paper>
          <div className="grafica-consulta" container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              {/* consumo */}
              {ferias.length > 0 && (
                <Paper className="grafica-space">
                  <GraficaConsumo ferias={ferias} etiqueta="Total de consumo" />
                  <Grid item xs={12} md={12} lg={12}>
                    <Paper className="grafica-space">
                      <Totales
                        title={"Total de consumo"}
                        amount={cantidad}
                        body={`Desde: ${moment(desde).format(
                          "YYYY-MM-DD"
                        )} / Hasta ${moment(hasta).format("YYYY-MM-DD")}`}
                      />
                    </Paper>
                  </Grid>
                </Paper>
              )}
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              {feriasUnica.length > 0 && (
                <Paper className="grafica-space">
                  <Grid item xs={12} md={12} lg={12}>
                    <Paper className="grafica-space">
                      <Totales
                        title={"Total de consumo"}
                        amount={feriasUnica[0].consumo}
                        body={`${feriasUnica[0].feria} : desde ${desde} hasta ${hasta}`}
                      />
                    </Paper>
                  </Grid>
                </Paper>
              )}
            </Grid>
          </div>
        </>
      )}
    </MainLayout>
  );
}

export default memo(ConsultasConsumo);

import React, { useState, useEffect, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import GraficaConsumo from "../../components/graficaBar/graficaBar.component";
import CircularProgress from "@material-ui/core/CircularProgress";
import { toast } from "react-toastify";
import Totales from "../../components/cuadroTotales/cuadroTotales.component";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import moment from "moment";
import "./consultas.styles.scss";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

function Consultas() {
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

  const [feriasSelect, setFeriasSelect] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [feriasUnica, setFeriasUnica] = useState([]);
  const [id_feria, setIdFeria] = useState("");
  const [desdeFeria, setDesdeFeria] = useState("");
  const [hastaFeria, setHastaFeria] = useState("");
  const [cantidadUnica, setCantidadUnica] = useState([]);

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

  const onClickBuscar = (e) => {
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

  const onClickBuscarFeria = (e) => {
    e.preventDefault();
    fetchdata(
      `${urlFeriaByFechabyId}${id_feria}?desde=${desdeFeria}&hasta=${hastaFeria}`,
      header,
      setFeriasUnica
    );
    // fetchdata(
    //   `${urlCantidad}?desde=${moment(desde).format(
    //     "YYYY-MM-DD"
    //   )}&hasta=${moment(hasta).format("YYYY-MM-DD")}`,
    //   header,
    //   setCantidad
    // );
  };

  const fetchdata = async (url, header, setter) => {
    setisLoading(false);
    try {
      const data = await fetch(url, header);
      const filtered = await data.json();
      UnauthorizedRedirect(filtered);
      if (filtered.length === 0) return msgError("No hay registros.");
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
        if (filtered.length === 0) return msgError("No hay registros.");
        setter(filtered);
        setisLoading(true);
      } catch (error) {
        msgError(error);
      }
    };
    fetchdata(urlFeria, header, setFeriasSelect);
  }, []);

  console.log("id_feria: ", id_feria);
  console.log("desdeFeria: ", desdeFeria);
  console.log("hastaFeria: ", hastaFeria);
  console.log("feriasUnica: ", feriasUnica);

  return (
    <MainLayout Tittle="Consultas">
      <Paper item xs={12} className="grid-principal-inputs">
        <div className="consultas-por-ferias">
          <h3>Consulta consumo total por ferias</h3>
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
        </div>
        <div className="consultas-por-feria-select">
          <div className="select-form">
            <h3>Consultas de consumo por feria</h3>
            <div className="select-form">
              <InputLabel id="pais-select-label">Ferias</InputLabel>
              <Select
                labelId="pais-select-label"
                id="pais-simple-select"
                className="inputs"
                onChange={(e) => onChangeSetter(e, setIdFeria)}
                autoWidth
                defaultValue={id_feria}
              >
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
              defaultValue={desdeFeria}
              className="inputs"
              type="date"
              onChange={(e) => onChangeSetter(e, setDesdeFeria)}
            />
          </div>
          <div className="select-form">
            <InputLabel id="hasta-label">Hasta</InputLabel>
            <TextField
              labelId="hasta-label"
              variant="outlined"
              defaultValue={hastaFeria}
              className="inputs"
              type="date"
              onChange={(e) => onChangeSetter(e, setHastaFeria)}
            />
          </div>
          <Grid item xs={12} md={12} lg={12}>
            {desdeFeria.length > 0 && hastaFeria.length && id_feria ? (
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
        <Grid item xs={6} md={6} lg={6}>
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
        <Grid item xs={6} md={6} lg={6}>
          {feriasUnica.length > 0 && (
            <Paper className="grafica-space">
              <Grid item xs={12} md={12} lg={12}>
                <Paper className="grafica-space">
                  <Totales
                    title={"Total de consumo"}
                    amount={feriasUnica[0].consumo}
                    body={`${feriasUnica[0].feria}: desde ${desdeFeria} hasta ${hastaFeria}`}
                  />
                </Paper>
              </Grid>
            </Paper>
          )}
        </Grid>
      </div>
    </MainLayout>
  );
}

export default Consultas;

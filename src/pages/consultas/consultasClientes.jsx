import React, { useState, useEffect, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { toast } from "react-toastify";
import Totales from "../../components/cuadroTotales/cuadroTotales.component";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "./consultas.styles.scss";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import GraficaClientes from "../../components/graficaBar/graficaBarClientes.component";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

function ConsultasClientes() {
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

  //input 3
  const [clientesTotalesPorFeria, setClientesTotalesPorFeria] = useState([]);
  const [cantidadClientesTotales, setClientestotales] = useState([]);
  const [desdeClientesTotales, setDesdeClientesTotales] = useState("");
  const [HastaClientesTotales, setHastaClientesTotales] = useState("");

  //input 4
  const [id_feria_cliente, setIdFeriaCliente] = useState("");
  const [clientesPorFeria, setClientesPorFeria] = useState([]);
  const [desdeClientePorFeria, setDesdeClientePorFeria] = useState("");
  const [hastaClientePorFeria, setHastaClientePorFeria] = useState("");

  //input 3
  const urlClientes = `${process.env.REACT_APP_BACK_END}/api/consultas/total-clientes`;
  const urlCantidadClientes = `${process.env.REACT_APP_BACK_END}/api/consultas/cantidad-clientes`;

  // input 4
  const urlClientesPorFeria = `${process.env.REACT_APP_BACK_END}/api/consultas/clientes/`;

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

  const onClickBuscarClientes = (e) => {
    e.preventDefault();
    fetchdata(
      `${urlClientes}?desde=${desdeClientesTotales}&hasta=${HastaClientesTotales}`,
      header,
      setClientesTotalesPorFeria
    );
    fetchdata(
      `${urlCantidadClientes}?desde=${desdeClientesTotales}&hasta=${HastaClientesTotales}`,
      header,
      setClientestotales
    );
  };

  const onClickBuscarClientesByFeria = (e) => {
    e.preventDefault();
    fetchdata(
      `${urlClientesPorFeria}${id_feria_cliente}?desde=${desdeClientePorFeria}&hasta=${hastaClientePorFeria}`,
      header,
      setClientesPorFeria
    );
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
        msgError(`No hay conexion... ${error}`);
      }
    };
    fetchdata(urlFeria, header, setFeriasSelect);
  }, []);

  return (
    <MainLayout Tittle="Consultas">
      {!isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Paper item xs={12} className="grid-principal-inputs">
            <div className="consultas-por-ferias">
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Cantidad de clientes por todas las ferias
              </Typography>
              <div className="select-form">
                <InputLabel id="desde-label">Desde</InputLabel>
                <TextField
                  labelId="desde-label"
                  variant="outlined"
                  defaultValue={desdeClientesTotales}
                  className="inputs"
                  type="date"
                  onChange={(e) => onChangeSetter(e, setDesdeClientesTotales)}
                />
              </div>
              <div className="select-form">
                <InputLabel id="hasta-label">Hasta</InputLabel>
                <TextField
                  labelId="hasta-label"
                  variant="outlined"
                  defaultValue={HastaClientesTotales}
                  className="inputs"
                  type="date"
                  onChange={(e) => onChangeSetter(e, setHastaClientesTotales)}
                />
              </div>
              <Grid item xs={12} md={12} lg={12}>
                {desdeClientesTotales.length > 0 &&
                HastaClientesTotales.length > 0 ? (
                  <Button
                    className="inputs"
                    variant="contained"
                    color="primary"
                    onClick={onClickBuscarClientes}
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
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  Cantidad de clientes por feria
                </Typography>
                <div className="select-form">
                  <InputLabel id="pais-select-label">Ferias</InputLabel>
                  <Select
                    labelId="pais-select-label"
                    id="pais-simple-select"
                    className="inputs"
                    onChange={(e) => onChangeSetter(e, setIdFeriaCliente)}
                    autoWidth
                    defaultValue={id_feria_cliente}
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
                  defaultValue={desdeClientePorFeria}
                  className="inputs"
                  type="date"
                  onChange={(e) => onChangeSetter(e, setDesdeClientePorFeria)}
                />
              </div>
              <div className="select-form">
                <InputLabel id="hasta-label">Hasta</InputLabel>
                <TextField
                  labelId="hasta-label"
                  variant="outlined"
                  defaultValue={hastaClientePorFeria}
                  className="inputs"
                  type="date"
                  onChange={(e) => onChangeSetter(e, setHastaClientePorFeria)}
                />
              </div>
              <Grid item xs={12} md={12} lg={12}>
                {desdeClientePorFeria.length > 0 &&
                hastaClientePorFeria.length &&
                id_feria_cliente ? (
                  <Button
                    className="inputs"
                    variant="contained"
                    color="primary"
                    onClick={onClickBuscarClientesByFeria}
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
            <Grid item xs={12} md={8} lg={8}>
              {/* clientes */}
              {clientesTotalesPorFeria.length > 0 && (
                <Paper className="grafica-space">
                  <GraficaClientes
                    clientes={clientesTotalesPorFeria}
                    etiqueta="Total de clientes"
                  />
                  <Grid item xs={12} md={12} lg={12}>
                    <Paper className="grafica-space">
                      <Totales
                        title={"Total de clientes por feria"}
                        amount={cantidadClientesTotales}
                        body={`Desde: ${desdeClientesTotales} / Hasta ${HastaClientesTotales}`}
                      />
                    </Paper>
                  </Grid>
                </Paper>
              )}
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              {clientesPorFeria.length > 0 && (
                <Paper className="grafica-space">
                  <Grid item xs={12} md={12} lg={12}>
                    <Paper className="grafica-space">
                      <Totales
                        title={"Total de clientes"}
                        amount={clientesPorFeria[0].clientes}
                        body={`${clientesPorFeria[0].nombre_feria}: desde ${desdeClientePorFeria} hasta ${hastaClientePorFeria}`}
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

export default memo(ConsultasClientes);

import React, { useState, useEffect, memo } from "react";
import MainLayout from "../../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { toast } from "react-toastify";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

function InventarioModify(match) {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const msgSuccess = (msj) => toast.success(msj);

  const UnauthorizedRedirect = (data) => {
    if (data === "No esta autorizado") {
      localStorage.clear();
      window.location.replace("/login");
    }
  };

  const [id_pais, setIdPais] = useState("");
  const [id_provincia, setIdProvincia] = useState("");
  const [id_distrito, setIdDistrito] = useState("");
  const [id_corregimiento, setIdCorregimiento] = useState("");
  const [id_feria, setIdFeria] = useState("");
  const [id_producto, setIdProducto] = useState("");
  const [total_inicial_disponible, setTotalInicialDisponible] = useState(0);
  const [disponible_real, setDisponibleReal] = useState(0);
  const [total_max_diario, setTotalMaxDiario] = useState(0);
  const [frecuencia_compra_dias, setFrecuenciaCompraDias] = useState(0);
  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_fin, setFechaFin] = useState("");
  const [observacion, setObservacion] = useState("");
  const [estado, setEstado] = useState(true);

  const [ferias, setFerias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pais, setPais] = useState([]);

  const { id } = match.match.params;
  const [isLoading, setisLoading] = useState(true);

  const urlBuscar = `${process.env.REACT_APP_BACK_END}/api/inventarios/buscar/`;
  const urlUpdate = `${process.env.REACT_APP_BACK_END}/api/inventarios/update`;

  const urlFeria = `${process.env.REACT_APP_BACK_END}/api/feria/filtrada`;
  const urlProducto = `${process.env.REACT_APP_BACK_END}/api/productos/filtrada`;
  const urlPais = `${process.env.REACT_APP_BACK_END}/api/pais/filtrada`;
  const urlBuscarFeria = `${process.env.REACT_APP_BACK_END}/api/feria/buscar/`;

  const bodyRequest = {
    id_pais: id_pais,
    id_provincia: parseInt(id_provincia),
    id_distrito: parseInt(id_distrito),
    id_corregimiento: parseInt(id_corregimiento),
    id_feria: parseInt(id_feria),
    id_producto: parseInt(id_producto),
    total_inicial_disponible: parseInt(total_inicial_disponible),
    disponible_real: parseInt(disponible_real),
    total_max_diario: parseInt(total_max_diario),
    frecuencia_compra_dias: parseInt(frecuencia_compra_dias),
    fecha_inicio: fecha_inicio,
    fecha_fin: fecha_fin,
    observacion: observacion,
    estado: estado,
    id_inventario: parseInt(id),
  };

  const header = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token_key}`,
    },
    mode: "cors",
    cache: "default",
  };

  const headerPut = {
    method: "PUT",
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token_key}`,
    },
    body: JSON.stringify(bodyRequest),
  };

  const onChangeSetter = (e, setter) => {
    setter(e.target.value);
  };

  const onClickGuardar = (e) => {
    e.preventDefault();
    fetch(urlUpdate, headerPut)
      .then((response) => response.json())
      .then((data) => {
        UnauthorizedRedirect(data);
        if (data === "success") {
          fetchDataBuscarInicio();
          fetchdata(urlProducto, header, setProductos);
          fetchdata(urlPais, header, setPais);
          fetchdata(urlFeria, header, setFerias);
          msgSuccess("Registro Exitoso.");
        } else {
          msgError(data);
        }
      });
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

  const fetchDataBuscar = async (e) => {
    setIdFeria(e.target.value);
    try {
      const data = await fetch(`${urlBuscarFeria}${e.target.value}`, header);
      const dat = await data.json();
      UnauthorizedRedirect(dat);
      dat.forEach((dt) => {
        setIdProvincia(dt.id_provincia);
        setIdDistrito(dt.id_distrito);
        setIdCorregimiento(dt.id_corregimiento);
      });
    } catch (error) {
      msgError(error);
    }
  };

  const fetchDataBuscarInicio = async () => {
    setisLoading(false);
    try {
      const data = await fetch(`${urlBuscar}${id}`, header);
      const dat = await data.json();
      UnauthorizedRedirect(dat);
      dat.forEach((dt) => {
        setIdPais(dt.id_pais);
        setIdProvincia(dt.id_provincia);
        setIdDistrito(dt.id_distrito);
        setIdCorregimiento(dt.id_corregimiento);
        setIdFeria(dt.id_feria);
        setIdProducto(dt.id_producto);
        setTotalInicialDisponible(dt.total_inicial_disponible);
        setDisponibleReal(dt.disponible_real);
        setTotalMaxDiario(dt.total_max_diario);
        setFrecuenciaCompraDias(dt.frecuencia_compra_dias);
        setFechaInicio(moment(dt.fecha_inicio).format("YYYY-MM-DD"));
        setFechaFin(moment(dt.fecha_fin).format("YYYY-MM-DD"));
        setObservacion(dt.observacion);
        setEstado(dt.estado === 1 ? true : false);
      });
      setisLoading(true);
    } catch (error) {
      msgError(error);
    }
  };

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
    const fetchDataBuscarInicio = async () => {
      setisLoading(false);
      try {
        const data = await fetch(`${urlBuscar}${id}`, header);
        const dat = await data.json();
        UnauthorizedRedirect(dat);
        dat.forEach((dt) => {
          setIdPais(dt.id_pais);
          setIdProvincia(dt.id_provincia);
          setIdDistrito(dt.id_distrito);
          setIdCorregimiento(dt.id_corregimiento);
          setIdFeria(dt.id_feria);
          setIdProducto(dt.id_producto);
          setTotalInicialDisponible(dt.total_inicial_disponible);
          setDisponibleReal(dt.disponible_real);
          setTotalMaxDiario(dt.total_max_diario);
          setFrecuenciaCompraDias(dt.frecuencia_compra_dias);
          setFechaInicio(moment(dt.fecha_inicio).format("YYYY-MM-DD"));
          setFechaFin(moment(dt.fecha_fin).format("YYYY-MM-DD"));
          setObservacion(dt.observacion);
          setEstado(dt.estado === 1 ? true : false);
        });
        setisLoading(true);
      } catch (error) {
        msgError(`No hay conexion... ${error}`);
      }
    };
    fetchDataBuscarInicio();
    fetchdata(urlProducto, header, setProductos);
    fetchdata(urlPais, header, setPais);
    fetchdata(urlFeria, header, setFerias);
  }, [urlBuscar, urlProducto, urlPais, urlFeria, id]);

  return (
    <MainLayout Tittle={`Modificar inventario #${id && id}`}>
      {!isLoading ? (
        <CircularProgress />
      ) : (
        <Grid item xs={12} md={12} lg={12}>
          <div className="header-container">
            <Button
              variant="contained"
              color="primary"
              onClick={match.history.goBack}
            >
              Atras
            </Button>
          </div>
          <Grid item xs={12} md={12} lg={12}>
            <Paper>
              <form onSubmit={onClickGuardar} className="inputs-container">
                <Grid item xs={12} md={6} lg={6}>
                  <div className="select-form">
                    <InputLabel id="pais-select-label">Pais</InputLabel>
                    <Select
                      labelId="pais-select-label"
                      id="pais-simple-select"
                      className="inputs"
                      onChange={(e) => onChangeSetter(e, setIdPais)}
                      autoWidth
                      value={id_pais}
                    >
                      {pais.map((pa) => {
                        return (
                          <MenuItem key={pa.id_pais} value={pa.id_pais}>
                            {pa.nombre_pais}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                  <div className="select-form">
                    <InputLabel id="feria-select-label">Ferias</InputLabel>
                    <Select
                      labelId="feria-select-label"
                      id="feria-simple-select"
                      className="inputs"
                      onChange={fetchDataBuscar}
                      autoWidth
                      value={id_feria}
                    >
                      {ferias.map((pa) => {
                        return (
                          <MenuItem key={pa.id_feria} value={pa.id_feria}>
                            {pa.nombre_feria}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                  <div className="select-form">
                    <InputLabel id="producto-select-label">
                      Productos
                    </InputLabel>
                    <Select
                      labelId="producto-select-label"
                      id="producto-simple-select"
                      className="inputs"
                      onChange={(e) => onChangeSetter(e, setIdProducto)}
                      autoWidth
                      value={id_producto}
                    >
                      {productos.map((pa) => {
                        return (
                          <MenuItem
                            key={pa.id_productos}
                            value={pa.id_productos}
                          >
                            {pa.nombre_productos}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                  <TextField
                    label="Observación"
                    variant="outlined"
                    value={observacion}
                    className="inputs"
                    type="text"
                    rows={3}
                    multiline
                    onChange={(e) => onChangeSetter(e, setObservacion)}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    label="Total inicial disponible"
                    variant="outlined"
                    value={total_inicial_disponible}
                    className="inputs"
                    type="number"
                    onChange={(e) => {
                      if (parseInt(e.target.value) >= 0) {
                        onChangeSetter(e, setTotalInicialDisponible);
                      }
                    }}
                  />
                  <TextField
                    label="Disponible real"
                    variant="outlined"
                    value={disponible_real}
                    className="inputs"
                    type="number"
                    onChange={(e) => {
                      if (parseInt(e.target.value) >= 0) {
                        onChangeSetter(e, setDisponibleReal);
                      }
                    }}
                  />
                  <TextField
                    label="Total máximo diario"
                    variant="outlined"
                    value={total_max_diario}
                    className="inputs"
                    type="number"
                    onChange={(e) => {
                      if (parseInt(e.target.value) >= 0) {
                        onChangeSetter(e, setTotalMaxDiario);
                      }
                    }}
                  />
                  <TextField
                    label="Frecuencia de compra"
                    variant="outlined"
                    value={frecuencia_compra_dias}
                    className="inputs"
                    type="number"
                    onChange={(e) => {
                      if (parseInt(e.target.value) >= 0) {
                        onChangeSetter(e, setFrecuenciaCompraDias);
                      }
                    }}
                  />
                  <div className="select-form">
                    <InputLabel id="inicio-label">Fecha de inicio</InputLabel>
                    <TextField
                      labelId="inicio-label"
                      variant="outlined"
                      value={fecha_inicio}
                      className="inputs"
                      type="date"
                      onChange={(e) => {
                        if (parseInt(e.target.value) >= 0) {
                          onChangeSetter(e, setFechaInicio);
                        }
                      }}
                    />
                  </div>
                  <div className="select-form">
                    <InputLabel id="fin-label">Fecha fin</InputLabel>
                    <TextField
                      labelId="fin-label"
                      variant="outlined"
                      value={fecha_fin}
                      className="inputs"
                      type="date"
                      onChange={(e) => onChangeSetter(e, setFechaFin)}
                    />
                  </div>
                  <FormControlLabel
                    label={estado ? "Activo" : "Inactivo"}
                    className="inputs"
                    control={
                      <Switch
                        checked={estado}
                        color="primary"
                        className="inputs"
                        inputProps={{ "aria-label": "primary checkbox" }}
                        onChange={() => setEstado(!estado)}
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Button
                    className="inputs"
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Guardar Modificación
                  </Button>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      )}
    </MainLayout>
  );
}

export default memo(InventarioModify);

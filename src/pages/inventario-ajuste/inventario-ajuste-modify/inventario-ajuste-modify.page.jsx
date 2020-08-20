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

function InventarioAjusteModify(match) {
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

  const [id_inventario, setIdInvenario] = useState("");
  const [id_feria, setIdFeria] = useState("");
  const [id_tipo_ajuste, setIdTipoAjuste] = useState("");
  const [cantidad_ajuste, setCantidadAjuste] = useState(0);
  const [observacion, setObservacion] = useState("");

  console.log("id_inventario: ", id_inventario);
  console.log("id_feria: ", id_feria);
  console.log("id_tipo_ajuste: ", id_tipo_ajuste);
  console.log("cantidad_ajuste: ", cantidad_ajuste);
  console.log("observacion: ", observacion);

  const [inventarios, setInventarios] = useState([]);
  const [tipo_ajuste, setTipoAjuste] = useState([]);

  const { id } = match.match.params;
  const [isLoading, setisLoading] = useState(true);

  const urlBuscar = `${process.env.REACT_APP_BACK_END}/api/inventarios-ajuste/buscar/`;
  const urlUpdate = `${process.env.REACT_APP_BACK_END}/api/inventarios-ajuste/update`;

  const urlInventario = `${process.env.REACT_APP_BACK_END}/api/inventarios/filtrada`;
  const urlTipoAjuste = `${process.env.REACT_APP_BACK_END}/api/tipo-ajustes/filtrada`;
  const urlBuscarInventario = `${process.env.REACT_APP_BACK_END}/api/inventarios/buscar/`;

  const bodyRequest = {
    id_inventario: parseInt(id_inventario),
    id_feria: parseInt(id_feria),
    id_tipo_ajuste: id_tipo_ajuste,
    cantidad_ajuste: parseInt(cantidad_ajuste),
    observacion: observacion,
    id: parseInt(id),
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
          fetchdata(urlInventario, header, setInventarios);
          fetchdata(urlTipoAjuste, header, setTipoAjuste);
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
    setIdInvenario(e.target.value);
    try {
      const data = await fetch(
        `${urlBuscarInventario}${e.target.value}`,
        header
      );
      const dat = await data.json();
      UnauthorizedRedirect(dat);
      dat.forEach((dt) => {
        setIdFeria(dt.id_feria);
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
        setIdInvenario(dt.id_inventario);
        setIdFeria(dt.id_feria);
        setIdTipoAjuste(dt.id_tipo_ajuste);
        setCantidadAjuste(dt.cantidad_ajuste);
        setObservacion(dt.observacion);
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
          setIdInvenario(dt.id_inventario);
          setIdFeria(dt.id_feria);
          setIdTipoAjuste(dt.id_tipo_ajuste);
          setCantidadAjuste(dt.cantidad_ajuste);
          setObservacion(dt.observacion);
        });
        setisLoading(true);
      } catch (error) {
        msgError(`No hay conexion... ${error}`);
      }
    };
    fetchDataBuscarInicio();
    fetchdata(urlInventario, header, setInventarios);
    fetchdata(urlTipoAjuste, header, setTipoAjuste);
  }, [urlBuscar, urlInventario, urlTipoAjuste, id]);

  return (
    <MainLayout Tittle={`Modificar inventario ajuste #${id && id}`}>
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
                    <InputLabel id="inventarios-select-label">
                      Inventarios
                    </InputLabel>
                    <Select
                      labelId="inventario-select-label"
                      id="inventario-simple-select"
                      className="inputs"
                      onChange={fetchDataBuscar}
                      autoWidth
                      value={id_inventario}
                    >
                      {inventarios.map((pa) => {
                        return (
                          <MenuItem
                            key={pa.id_inventario}
                            value={pa.id_inventario}
                          >
                            {`${pa.id_inventario} - ${pa.nombre_feria}`}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                  <div className="select-form">
                    <InputLabel id="tipo-ajuste-select-label">
                      Tipo de Ajustes
                    </InputLabel>
                    <Select
                      labelId="tipo-ajuste-select-label"
                      id="tipo-ajuste-simple-select"
                      className="inputs"
                      onChange={(e) => onChangeSetter(e, setIdTipoAjuste)}
                      autoWidth
                      value={id_tipo_ajuste}
                    >
                      {tipo_ajuste.map((pa) => {
                        return (
                          <MenuItem
                            key={pa.id_tipo_ajuste}
                            value={pa.id_tipo_ajuste}
                          >
                            {pa.id_tipo_ajuste}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    label="Cantidad de ajuste"
                    variant="outlined"
                    value={cantidad_ajuste}
                    className="inputs"
                    type="number"
                    onChange={(e) => onChangeSetter(e, setCantidadAjuste)}
                  />
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

export default memo(InventarioAjusteModify);

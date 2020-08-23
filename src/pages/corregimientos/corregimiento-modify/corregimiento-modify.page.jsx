import React, { useState, useEffect, memo } from "react";
import MainLayout from "../../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { toast } from "react-toastify";
import "moment/locale/es.js";

function CorregimientoModify(match) {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const msgSuccess = (msj) => toast.success(msj);

  const { id } = match.match.params;

  const [id_provincia, setIdProvincia] = useState("");
  const [id_distrito, setIdDistrito] = useState("");
  const [nombre_corregimiento, setNombreCorregimiento] = useState("");

  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);

  const [estado, setEstado] = useState(true);
  const [isLoading, setisLoading] = useState(true);

  const urlCorregimientoBuscar = `${process.env.REACT_APP_BACK_END}/api/corregimientos/buscar/${id}`;
  const urlCorregimientoUpdate = `${process.env.REACT_APP_BACK_END}/api/corregimientos/update`;
  const urlProvincia = `${process.env.REACT_APP_BACK_END}/api/provincias/filtrada`;
  const urlDistrito = `${process.env.REACT_APP_BACK_END}/api/distritos/buscarDistritoByProvincia/`;

  const UnauthorizedRedirect = (data) => {
    if (data === "No esta autorizado") {
      localStorage.clear();
      window.location.replace("/login");
    }
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

  const onChangeSetter = (e, setter) => {
    setter(e.target.value);
  };

  const onChange = (e) => {
    setIdProvincia(e.target.value);
    setDistritos([]);
    fetch(`${urlDistrito}${e.target.value}`, header)
      .then((response) => response.json())
      .then((data) => {
        UnauthorizedRedirect(data);
        setDistritos(data);
      });
  };

  const bodyRequest = {
    id_corregimiento: parseInt(id),
    id_provincia: id_provincia,
    id_distrito: id_distrito,
    nombre_corregimiento: nombre_corregimiento,
    estado: estado,
  };

  const headerPut = {
    method: "PUT",
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token_key}`,
    },
    body: JSON.stringify(bodyRequest),
  };

  const onClickGuardar = () => {
    fetch(urlCorregimientoUpdate, headerPut)
      .then((response) => response.json())
      .then((data) => {
        UnauthorizedRedirect(data);
        if (data === "success") {
          msgSuccess("Registro Exitoso.");
        } else {
          msgError(data);
        }
      });
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
        msgError(error);
      }
    };
    const fetchDataBuscar = async () => {
      setisLoading(false);
      try {
        const data = await fetch(urlCorregimientoBuscar, header);
        const dat = await data.json();
        UnauthorizedRedirect(dat);
        dat.forEach((dt) => {
          setIdProvincia(dt.id_provincia);
          setIdDistrito(dt.id_distrito);
          setNombreCorregimiento(dt.nombre_corregimiento);
          setEstado(dt.estado === 1 ? true : false);
        });
        fetchdata(urlProvincia, header, setProvincias);
        fetchdata(`${urlDistrito}${dat[0].id_provincia}`, header, setDistritos);
        setisLoading(true);
      } catch (error) {
        msgError(`No hay conexion... ${error}`);
      }
    };
    fetchDataBuscar();
  }, [urlCorregimientoBuscar, urlProvincia, urlDistrito]);

  return (
    <MainLayout Tittle={`Editar`}>
      {!isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
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
            <Paper className="modify-inputs-container">
              <div className="select-form">
                <InputLabel id="demo-simple-select-label">
                  Provincias
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  className="modify-inputs"
                  onChange={(e) => onChange(e)}
                  value={id_provincia}
                  autoWidth
                >
                  {provincias.map((pa, i) => {
                    return (
                      <MenuItem key={i} value={pa.id_provincia}>
                        {pa.nombre_provincia}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <div className="select-form">
                <InputLabel id="demo-simple-select-label">Distritos</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  className="modify-inputs"
                  onChange={(e) => onChangeSetter(e, setIdDistrito)}
                  value={id_distrito}
                  autoWidth
                >
                  {distritos.map((pa, i) => {
                    return (
                      <MenuItem key={i} value={pa.id_distrito}>
                        {pa.nombre_distrito}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <TextField
                label="Corregimiento"
                variant="outlined"
                value={nombre_corregimiento}
                className="modify-inputs"
                onChange={(e) => onChange(e, setNombreCorregimiento)}
              />
              <FormControlLabel
                label={estado ? "Activo" : "Inactivo"}
                control={
                  <Switch
                    checked={estado}
                    color="primary"
                    className="modify-inputs"
                    inputProps={{ "aria-label": "primary checkbox" }}
                    onChange={() => setEstado(!estado)}
                  />
                }
              />
              <Button
                variant="contained"
                color="primary"
                className="modify-inputs"
                onClick={onClickGuardar}
              >
                Guardar Modificación
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </MainLayout>
  );
}

export default memo(CorregimientoModify);

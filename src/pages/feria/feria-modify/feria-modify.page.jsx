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

function FeriaModify(match) {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const msgSuccess = (msj) => toast.success(msj);

  const { id } = match.match.params;

  const [id_provincia, setIdProvincia] = useState("");
  const [id_distrito, setIdDistrito] = useState("");
  const [id_corregimiento, setIdCorregimiento] = useState("");
  const [nombre_feria, setNombreFeria] = useState("");
  const [descripcion_lugar, setDescripcionLugar] = useState("");
  const [descripcion_feria, setDescripcionFeria] = useState("");

  const [corregimientos, setCorregimientos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);

  const [estado, setEstado] = useState(true);
  const [isLoading, setisLoading] = useState(true);

  const urlBuscar = `${process.env.REACT_APP_BACK_END}/api/feria/buscar/${id}`;
  const urlUpdate = `${process.env.REACT_APP_BACK_END}/api/feria/update`;

  const urlCorregimientos = `${process.env.REACT_APP_BACK_END}/api/corregimientos/buscarCorregimientoByDistrito/`;
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
      const data = await fetch(urlBuscar, header);
      const dat = await data.json();
      UnauthorizedRedirect(dat);
      dat.forEach((dt) => {
        setNombreFeria(dt.nombre_feria);
        setDescripcionLugar(dt.descripcion_lugar);
        setDescripcionFeria(dt.nombre_corregimiento);
        setIdProvincia(dt.id_provincia);
        setIdDistrito(dt.id_distrito);
        setIdCorregimiento(dt.id_corregimiento);
        setEstado(dt.estado === 1 ? true : false);
      });
      fetchdata(`${urlDistrito}${dat[0].id_provincia}`, header, setDistritos);
      fetchdata(
        `${urlCorregimientos}${dat[0].id_distrito}`,
        header,
        setCorregimientos
      );
      setisLoading(true);
    } catch (error) {
      msgError(error);
    }
  };

  const onChangeProvincia = (e) => {
    setIdProvincia(e.target.value);
    setDistritos([]);
    setCorregimientos([]);

    fetch(`${urlDistrito}${e.target.value}`, header)
      .then((response) => response.json())
      .then((data) => {
        UnauthorizedRedirect(data);
        setDistritos(data);
      });
  };

  const onChangeDistrito = (e) => {
    setIdDistrito(e.target.value);
    fetch(`${urlCorregimientos}${e.target.value}`, header)
      .then((response) => response.json())
      .then((data) => {
        console.log("data:", data);
        UnauthorizedRedirect(data);
        setCorregimientos(data);
      });
  };

  const onChange = (e, setter) => {
    setter(e.target.value);
  };

  const bodyRequest = {
    id_feria: id,
    nombre_feria: nombre_feria,
    id_provincia: id_provincia,
    id_distrito: id_distrito,
    id_corregimiento: id_corregimiento,
    descripcion_lugar: descripcion_lugar,
    descripcion_feria: descripcion_feria,
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
    fetch(urlUpdate, headerPut)
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
    fetchDataBuscar();
  }, []);

  useEffect(() => {
    fetchdata(urlProvincia, header, setProvincias);
  }, [urlProvincia]);

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
                <InputLabel id="provincias-select-label">Provincias</InputLabel>
                <Select
                  labelId="provincias-select-label"
                  id="provincias-simple-select"
                  className="modify-inputs"
                  onChange={(e) => onChangeProvincia(e)}
                  autoWidth
                  defaultValue={id_provincia}
                >
                  {provincias.map((pa) => {
                    return (
                      <MenuItem key={pa.id_provincia} value={pa.id_provincia}>
                        {pa.nombre_provincia}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <div className="select-form">
                <InputLabel id="distrito-select-label">Distrito</InputLabel>
                <Select
                  labelId="distrito-select-label"
                  id="distrito-simple-select"
                  className="modify-inputs"
                  onChange={(e) => onChangeDistrito(e)}
                  autoWidth
                  defaultValue={id_distrito}
                >
                  {distritos.map((pa) => {
                    return (
                      <MenuItem key={pa.id_distrito} value={pa.id_distrito}>
                        {pa.nombre_distrito}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <div className="select-form">
                <InputLabel id="corregimiento-select-label">
                  Corregimiento
                </InputLabel>
                <Select
                  labelId="corregimiento-select-label"
                  id="corregimiento-simple-select"
                  className="modify-inputs"
                  onChange={(e) => onChange(e, setIdCorregimiento)}
                  autoWidth
                  defaultValue={id_corregimiento}
                >
                  {corregimientos.map((pa) => {
                    return (
                      <MenuItem
                        key={pa.id_corregimiento}
                        value={pa.id_corregimiento}
                      >
                        {pa.nombre_corregimiento}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <TextField
                label="Feria"
                variant="outlined"
                value={nombre_feria}
                className="modify-inputs"
                onChange={(e) => onChange(e, setNombreFeria)}
              />
              <TextField
                label="Lugar"
                variant="outlined"
                multiline
                value={descripcion_lugar}
                className="modify-inputs"
                onChange={(e) => onChange(e, setDescripcionLugar)}
              />
              <TextField
                label="Descripcion"
                variant="outlined"
                multiline
                value={descripcion_feria}
                className="modify-inputs"
                onChange={(e) => onChange(e, setDescripcionFeria)}
              />

              <FormControlLabel
                label={estado ? "Activo" : "Inactivo"}
                className="modify-inputs"
                control={
                  <Switch
                    checked={estado}
                    color="primary"
                    className={`inputs`}
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

export default memo(FeriaModify);

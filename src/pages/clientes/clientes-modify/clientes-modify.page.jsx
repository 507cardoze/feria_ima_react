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

function ClientesModify(match) {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const msgSuccess = (msj) => toast.success(msj);

  const [num_documento, setNumDocumento] = useState("");
  const [nombre, setnombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [genero, setGenero] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [lugar_nacimiento, setLugarNacimiento] = useState("");
  const [tipo_sangre, setTipoSangre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fecha_expiracion, setFechaExpiracion] = useState("");

  const { id } = match.match.params;
  const [isLoading, setisLoading] = useState(true);

  const urlBuscar = `${process.env.REACT_APP_BACK_END}/api/clientes/buscar/${id}`;
  const urlUpdate = `${process.env.REACT_APP_BACK_END}/api/clientes/update`;

  const UnauthorizedRedirect = (data) => {
    if (data === "No esta autorizado") {
      localStorage.clear();
      window.location.replace("/login");
    }
  };

  const onChangeSetter = (e, setter) => {
    setter(e.target.value);
  };

  const bodyRequest = {
    id_cliente: parseInt(id),
    num_documento: num_documento.toUpperCase(),
    nombre: nombre.toUpperCase(),
    apellido: apellido.toUpperCase(),
    genero: genero,
    fecha_nacimiento: fecha_nacimiento,
    nacionalidad: nacionalidad.toUpperCase(),
    lugar_nacimiento: lugar_nacimiento.toUpperCase(),
    tipo_sangre: tipo_sangre,
    direccion: direccion.toUpperCase(),
    fecha_expiracion: fecha_expiracion,
  };

  const headerPut = {
    method: "PUT",
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token_key}`,
    },
    body: JSON.stringify(bodyRequest),
  };

  const onClickGuardar = (e) => {
    e.preventDefault();
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
    const header = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token_key}`,
      },
      mode: "cors",
      cache: "default",
    };
    const fetchDataBuscar = async () => {
      setisLoading(false);
      try {
        const data = await fetch(`${urlBuscar}`, header);
        const dat = await data.json();
        UnauthorizedRedirect(dat);
        dat.forEach((dt) => {
          setNumDocumento(dt.num_documento);
          setnombre(dt.nombre);
          setApellido(dt.apellido);
          setGenero(dt.genero);
          setTipoSangre(dt.tipo_sangre);
          setNacionalidad(dt.nacionalidad);
          setLugarNacimiento(dt.lugar_nacimiento);
          setDireccion(dt.direccion);
          setFechaNacimiento(moment(dt.fecha_nacimiento).format("YYYY-MM-DD"));
          setFechaExpiracion(moment(dt.fecha_expiracion).format("YYYY-MM-DD"));
        });
        setisLoading(true);
      } catch (error) {
        msgError(`No hay conexion... ${error}`);
      }
    };
    fetchDataBuscar();
  }, [urlBuscar]);

  useEffect(() => {
    const urlValidated = `${process.env.REACT_APP_BACK_END}/api/auth/validated`;
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

    const fetchdata = async (url, header) => {
      try {
        const data = await fetch(url, header);
        const filtered = await data.json();
        UnauthorizedRedirect(filtered);
        if (filtered.web === 0) {
          window.location.replace("/clientes");
        }
      } catch (error) {
        localStorage.clear();
        window.location.replace("/login");
      }
    };
    fetchdata(urlValidated, header);
  }, []);

  return (
    <MainLayout Tittle={`Modificar ${num_documento && num_documento}`}>
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
          <Paper>
            <form onSubmit={onClickGuardar} className="inputs-container">
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  label="Cedula"
                  variant="outlined"
                  value={num_documento}
                  className="inputs"
                  type="text"
                  onChange={(e) => onChangeSetter(e, setNumDocumento)}
                />
                <TextField
                  label="Nombre"
                  variant="outlined"
                  value={nombre}
                  className="inputs"
                  type="text"
                  onChange={(e) => onChangeSetter(e, setnombre)}
                />
                <TextField
                  label="Apellido"
                  variant="outlined"
                  value={apellido}
                  className="inputs"
                  type="text"
                  onChange={(e) => onChangeSetter(e, setApellido)}
                />
                <TextField
                  label="Nacionalidad"
                  variant="outlined"
                  value={nacionalidad}
                  className="inputs"
                  type="text"
                  onChange={(e) => onChangeSetter(e, setNacionalidad)}
                />
                <TextField
                  label="Lugar de Nacimiento"
                  variant="outlined"
                  value={lugar_nacimiento}
                  className="inputs"
                  multiline
                  type="text"
                  onChange={(e) => onChangeSetter(e, setLugarNacimiento)}
                />

                <TextField
                  label="Direccion"
                  variant="outlined"
                  value={direccion}
                  className="inputs"
                  multiline
                  type="text"
                  onChange={(e) => onChangeSetter(e, setDireccion)}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <div className="select-form">
                  <InputLabel id="sangre-select-label">
                    Tipo de sangre
                  </InputLabel>
                  <Select
                    labelId="sangre-select-label"
                    id="sangre-simple-select"
                    className="inputs"
                    onChange={(e) => onChangeSetter(e, setTipoSangre)}
                    autoWidth
                    value={tipo_sangre}
                  >
                    <MenuItem value="O-">O negativo</MenuItem>
                    <MenuItem value="O+">O positivo</MenuItem>
                    <MenuItem value="A-">A negativo</MenuItem>
                    <MenuItem value="A+">A positivo</MenuItem>
                    <MenuItem value="B-">B negativo</MenuItem>
                    <MenuItem value="B+">B positivo</MenuItem>
                    <MenuItem value="AB+">AB negativo</MenuItem>
                    <MenuItem value="AB-">AB positivo</MenuItem>
                    <MenuItem value="NA">No Sabe</MenuItem>
                  </Select>
                </div>
                <div className="select-form">
                  <InputLabel id="genero-select-label">Genero</InputLabel>
                  <Select
                    labelId="genero-select-label"
                    id="genero-simple-select"
                    className="inputs"
                    onChange={(e) => onChangeSetter(e, setGenero)}
                    autoWidth
                    value={genero}
                  >
                    <MenuItem value="M">Masculino</MenuItem>
                    <MenuItem value="F">Femenino</MenuItem>
                  </Select>
                </div>
                <div className="select-form">
                  <InputLabel id="nacimiento-label">
                    Fecha de nacimiento
                  </InputLabel>
                  <TextField
                    labelId="nacimiento-label"
                    variant="outlined"
                    value={fecha_nacimiento}
                    className="inputs"
                    type="date"
                    onChange={(e) => onChangeSetter(e, setFechaNacimiento)}
                  />
                </div>
                <div className="select-form">
                  <InputLabel id="expiracion-label">
                    Fecha de expiracion
                  </InputLabel>
                  <TextField
                    labelId="expiracion-label"
                    variant="outlined"
                    value={fecha_expiracion}
                    className="inputs"
                    type="date"
                    onChange={(e) => onChangeSetter(e, setFechaExpiracion)}
                  />
                </div>
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
      )}
    </MainLayout>
  );
}

export default memo(ClientesModify);

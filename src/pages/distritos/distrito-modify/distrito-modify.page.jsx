import React, { useState, useEffect } from "react";
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

function DistritoModify(match) {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const msgSuccess = (msj) => toast.success(msj);

  const { id } = match.match.params;

  const [provincia, setProvincia] = useState([]);
  const [distrito_nombre, setDistritoNombre] = useState("");
  const [id_provincia, setId_provincia] = useState("");
  const [estado, setEstado] = useState(true);
  const [isLoading, setisLoading] = useState(true);

  const urlDistritoBuscar = `${process.env.REACT_APP_BACK_END}/api/distritos/buscar/${id}`;
  const urlDistritoUpdate = `${process.env.REACT_APP_BACK_END}/api/distritos/update`;
  const urlProvincia = `${process.env.REACT_APP_BACK_END}/api/provincias/filtrada`;

  const UnauthorizedRedirect = (data) => {
    if (data === "No esta autorizado") {
      localStorage.clear();
      window.location.replace("/login");
    }
  };

  const onChange = (e, setter) => {
    setter(e.target.value);
  };

  const bodyRequest = {
    id_distrito: parseInt(id),
    id_provincia: id_provincia,
    nombre_distrito: distrito_nombre,
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
    fetch(urlDistritoUpdate, headerPut)
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
    const fetchDataBuscar = async () => {
      setisLoading(false);
      try {
        const data = await fetch(urlDistritoBuscar, header);
        const dat = await data.json();
        UnauthorizedRedirect(dat);
        dat.forEach((dt) => {
          setId_provincia(dt.id_provincia);
          setDistritoNombre(dt.nombre_distrito);
          setEstado(dt.estado === 1 ? true : false);
        });
        setisLoading(true);
      } catch (error) {
        msgError(error);
      }
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
    const header = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token_key}`,
      },
      mode: "cors",
      cache: "default",
    };
    fetchDataBuscar();
    fetchdata(urlProvincia, header, setProvincia);
  }, [urlDistritoBuscar, urlProvincia]);

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
                  onChange={(e) => onChange(e, setId_provincia)}
                  value={id_provincia}
                  autoWidth
                >
                  {provincia.map((pa) => {
                    return (
                      <MenuItem key={pa.id_provincia} value={pa.id_provincia}>
                        {pa.nombre_provincia}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <TextField
                label="Distrito"
                variant="outlined"
                value={distrito_nombre}
                className="modify-inputs"
                onChange={(e) => onChange(e, setDistritoNombre)}
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

export default DistritoModify;

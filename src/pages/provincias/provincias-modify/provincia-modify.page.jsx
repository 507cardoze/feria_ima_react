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
import "./provincia-modify.styles.scss";
import { toast } from "react-toastify";

function ProvinciaModify(match) {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const msgSuccess = (msj) => toast.success(msj);

  const { id } = match.match.params;

  const [pais, setPais] = useState([]);
  const [provincia, setProvincia] = useState([]);

  const [provincia_nombre, setProvinciaNombre] = useState("");
  const [id_pais, setId_pais] = useState("");
  const [estado, setEstado] = useState(true);
  const [isLoading, setisLoading] = useState(true);

  const urlProviciaBuscar = `${process.env.REACT_APP_BACK_END}/api/provincias/buscar/${id}`;
  const urlProvinciaUpdate = `${process.env.REACT_APP_BACK_END}/api/provincias/update`;
  const urlPais = `${process.env.REACT_APP_BACK_END}/api/pais/filtrada`;

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
      const data = await fetch(urlProviciaBuscar, header);
      const dat = await data.json();
      UnauthorizedRedirect(dat);
      dat.forEach((dt) => {
        setId_pais(dt.id_pais);
        setProvinciaNombre(dt.nombre_provincia);
        setEstado(dt.estado === 1 ? true : false);
      });
      setProvincia(dat);
      setisLoading(true);
    } catch (error) {
      msgError(error);
    }
  };

  useEffect(() => {
    fetchDataBuscar();
    fetchdata(urlPais, header, setPais);
  }, [localStorage.token_key]);

  const onChange = (e, setter) => {
    setter(e.target.value);
  };

  const bodyRequest = {
    id_provincia: parseInt(id),
    id_pais: id_pais,
    nombre_provincia: provincia_nombre,
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
    fetch(urlProvinciaUpdate, headerPut)
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

  return (
    <MainLayout
      Tittle={`Editar ${provincia.length > 0 && provincia[0].nombre_provincia}`}
    >
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
                <InputLabel id="demo-simple-select-label">Pais</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  className="modify-inputs"
                  onChange={(e) => onChange(e, setId_pais)}
                  value={id_pais}
                  autoWidth
                >
                  {pais.map((pa, i) => {
                    return (
                      <MenuItem key={i} value={pa.id_pais}>
                        {pa.nombre_pais}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <TextField
                label="Provincia"
                variant="outlined"
                value={provincia_nombre}
                className="modify-inputs"
                onChange={(e) => onChange(e, setProvinciaNombre)}
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

export default ProvinciaModify;

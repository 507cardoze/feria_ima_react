import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "./pais-modify.styles.scss";
import { toast } from "react-toastify";

function PaisModify(match) {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const msgSuccess = (msj) => toast.success(msj);

  const { id } = match.match.params;

  const [pais, setPais] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [estado, setEstado] = useState(true);
  const [isLoading, setisLoading] = useState(true);

  const urlPaisBuscar = `${process.env.REACT_APP_BACK_END}/api/pais/buscar/${id}`;
  const urlPaisUpdate = `${process.env.REACT_APP_BACK_END}/api/pais/update`;

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
  const fetchData = async () => {
    setisLoading(false);
    try {
      const data_pais = await fetch(urlPaisBuscar, header);
      const pa = await data_pais.json();
      UnauthorizedRedirect(pa);
      pa.forEach((pais) => {
        setPais(pais.nombre_pais);
        setNacionalidad(pais.nombre_nacionalidad);
        setEstado(pais.estado === 1 ? true : false);
      });
      setisLoading(true);
    } catch (error) {
      msgError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [localStorage.token_key]);

  const onchangePais = (e) => {
    setPais(e.target.value);
  };

  const onchangeNacionalidad = (e) => {
    setNacionalidad(e.target.value);
  };

  const onchangeEstado = (e) => {
    setEstado(e.target.checked);
  };

  const bodyRequest = {
    nomesclatura: id,
    pais: pais,
    nacionalidad: nacionalidad,
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
    fetch(urlPaisUpdate, headerPut)
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
    <MainLayout Tittle={`Editar ${id}`}>
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
            <Paper className="pais-modify-inputs-container">
              <TextField
                label="Pais"
                variant="outlined"
                value={pais}
                className="pais-modify-inputs"
                onChange={(e) => onchangePais(e)}
              />
              <TextField
                label="Nacionalidad"
                variant="outlined"
                value={nacionalidad}
                className="pais-modify-inputs"
                onChange={(e) => onchangeNacionalidad(e)}
              />
              <FormControlLabel
                label={estado ? "Activo" : "Inactivo"}
                control={
                  <Switch
                    checked={estado}
                    color="primary"
                    className="pais-modify-switch"
                    inputProps={{ "aria-label": "primary checkbox" }}
                    onChange={() => setEstado(!estado)}
                  />
                }
              />
              <Button
                variant="contained"
                color="primary"
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

export default PaisModify;

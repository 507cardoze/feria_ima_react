import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { toast } from "react-toastify";

function TipoModify(match) {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const msgSuccess = (msj) => toast.success(msj);

  const { id } = match.match.params;

  const [id_tipo_ajuste, setIdTipoAjuste] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState(true);

  const [isLoading, setisLoading] = useState(true);

  const urlBuscar = `${process.env.REACT_APP_BACK_END}/api/tipo-ajustes/buscar/${id}`;
  const urlUpdate = `${process.env.REACT_APP_BACK_END}/api/tipo-ajustes/update`;

  const UnauthorizedRedirect = (data) => {
    if (data === "No esta autorizado") {
      localStorage.clear();
      window.location.replace("/login");
    }
  };

  const onChange = (e, setter) => {
    setter(e.target.value);
  };

  const bodyRequest = {};

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
        const data_pais = await fetch(urlBuscar, header);
        const pa = await data_pais.json();
        UnauthorizedRedirect(pa);
        pa.forEach((pais) => {
          setIdTipoAjuste(pais.id_tipo_ajuste);
          setDescripcion(pais.descripcion);
          setEstado(pais.estado === 1 ? true : false);
        });
        setisLoading(true);
      } catch (error) {
        msgError(error);
      }
    };
    fetchData();
  }, [urlBuscar]);

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
            <Paper className="modify-inputs-container">
              <TextField
                label="Tipo de Ajuste"
                variant="outlined"
                value={id_tipo_ajuste}
                className="modify-inputs"
                onChange={(e) => onChange(e, setIdTipoAjuste)}
              />
              <TextField
                label="Descripcion"
                variant="outlined"
                value={descripcion}
                className="modify-inputs"
                onChange={(e) => onChange(e, setDescripcion)}
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
                className="modify-inputs"
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

export default TipoModify;

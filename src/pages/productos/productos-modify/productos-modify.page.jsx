import React, { useState, useEffect, memo } from "react";
import MainLayout from "../../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

function ProductosModify(match) {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const msgSuccess = (msj) => toast.success(msj);

  const [nombre_productos, setNombreProductos] = useState("");
  const [frecuencia_compra_dias, setFrecuenciaCompra] = useState(0);
  const [estado, setEstado] = useState(true);

  const { id } = match.match.params;
  const [isLoading, setisLoading] = useState(true);

  const urlBuscar = `${process.env.REACT_APP_BACK_END}/api/productos/buscar/${id}`;
  const urlUpdate = `${process.env.REACT_APP_BACK_END}/api/productos/update`;

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
    nombre_productos: nombre_productos,
    frecuencia_compra_dias: frecuencia_compra_dias,
    estado: estado,
    id_productos: id,
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
          setNombreProductos(dt.nombre_productos);
          setFrecuenciaCompra(dt.frecuencia_compra_dias);
          setEstado(dt.estado === 1 ? true : false);
        });
        setisLoading(true);
      } catch (error) {
        msgError(`No hay conexion... ${error}`);
      }
    };
    fetchDataBuscar();
  }, [urlBuscar]);

  return (
    <MainLayout Tittle={`Modificar ${nombre_productos && nombre_productos}`}>
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
                  label="Nombre del producto"
                  variant="outlined"
                  value={nombre_productos}
                  className="inputs"
                  type="text"
                  onChange={(e) => onChangeSetter(e, setNombreProductos)}
                />
                <TextField
                  label="Frecuencia de compra"
                  variant="outlined"
                  value={frecuencia_compra_dias}
                  className="inputs"
                  type="number"
                  onChange={(e) => {
                    if (parseInt(e.target.value) >= 0) {
                      onChangeSetter(e, setFrecuenciaCompra);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
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
      )}
    </MainLayout>
  );
}

export default memo(ProductosModify);

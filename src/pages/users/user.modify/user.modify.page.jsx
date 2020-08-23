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

function UsuarioModify(match) {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const msgSuccess = (msj) => toast.success(msj);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState(true);
  const [web, setWeb] = useState(true);
  const [terminal, setTerminal] = useState(true);

  const { id } = match.match.params;
  const [isLoading, setisLoading] = useState(true);

  const urlBuscar = `${process.env.REACT_APP_BACK_END}/api/auth/buscar/${id}`;
  const urlUpdate = `${process.env.REACT_APP_BACK_END}/api/auth/update`;

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
  const fetchDataBuscar = async () => {
    setisLoading(false);
    try {
      const data = await fetch(`${urlBuscar}`, header);
      const dat = await data.json();
      UnauthorizedRedirect(dat);
      dat.forEach((dt) => {
        setName(dt.name);
        setEmail(dt.email);
        setEstado(dt.active === "Y" ? true : false);
        setWeb(dt.web === 1 ? true : false);
        setTerminal(dt.terminal === 1 ? true : false);
      });
      setisLoading(true);
    } catch (error) {
      msgError(`No hay conexion... ${error}`);
    }
  };

  const onChangeSetter = (e, setter) => {
    setter(e.target.value);
  };

  const bodyRequest = {
    login: id,
    name: name,
    email: email,
    active: estado,
    web: web,
    terminal: terminal,
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
          fetchDataBuscar();
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
          setName(dt.name);
          setEmail(dt.email);
          setEstado(dt.active === "Y" ? true : false);
          setWeb(dt.web === 1 ? true : false);
          setTerminal(dt.terminal === 1 ? true : false);
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
          window.location.replace("/usuarios");
        }
      } catch (error) {
        localStorage.clear();
        window.location.replace("/login");
      }
    };
    fetchdata(urlValidated, header);
  }, []);

  return (
    <MainLayout Tittle={`Modificar ${id && id}`}>
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
                  label="Nombre"
                  variant="outlined"
                  value={name}
                  className="inputs"
                  type="text"
                  onChange={(e) => onChangeSetter(e, setName)}
                />
                <TextField
                  label="Correo Electronico"
                  variant="outlined"
                  value={email}
                  className="inputs"
                  type="email"
                  onChange={(e) => onChangeSetter(e, setEmail)}
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
                <FormControlLabel
                  label={web ? "Administrador" : "Solo lectura"}
                  className="inputs"
                  control={
                    <Switch
                      checked={web}
                      color="primary"
                      className="inputs"
                      inputProps={{ "aria-label": "primary checkbox" }}
                      onChange={() => setWeb(!web)}
                    />
                  }
                />
                <FormControlLabel
                  label={"Acceso Terminal"}
                  className="inputs"
                  control={
                    <Switch
                      checked={terminal}
                      color="primary"
                      className="inputs"
                      inputProps={{ "aria-label": "primary checkbox" }}
                      onChange={() => setTerminal(!terminal)}
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

export default memo(UsuarioModify);

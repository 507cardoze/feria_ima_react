import React, { useState, useEffect, memo } from "react";
import MainLayout from "../../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";

function Password(match) {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const msgSuccess = (msj) => toast.success(msj);

  const [password, setPassword] = useState("");
  const [repeat_password, setRepeatPassword] = useState("");

  const { id } = match.match.params;

  const urlReset = `${process.env.REACT_APP_BACK_END}/api/auth/reset-password`;

  console.log(urlReset);

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
    login: id,
    password: password,
    repeat_password: repeat_password,
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
    if (password !== repeat_password)
      return msgError("Las Contraseña deben ser iguales");
    fetch(urlReset, headerPut)
      .then((response) => response.json())
      .then((data) => {
        console.log("", data);
        UnauthorizedRedirect(data);
        if (data === "success") {
          msgSuccess("Registro Exitoso.");
        } else {
          msgError(data);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

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
            <Grid item xs={12} md={12} lg={12}>
              <TextField
                label="Contraseña"
                variant="outlined"
                value={password}
                className="inputs"
                type="text"
                onChange={(e) => onChangeSetter(e, setPassword)}
              />
              <TextField
                label="Repetir Contraseña"
                variant="outlined"
                value={repeat_password}
                className="inputs"
                type="text"
                onChange={(e) => onChangeSetter(e, setRepeatPassword)}
              />
              <Button
                className="inputs"
                variant="contained"
                color="primary"
                type="submit"
              >
                Cambiar Contraseña
              </Button>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </MainLayout>
  );
}

export default memo(Password);

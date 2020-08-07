import React, { useState, useEffect } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import DataTable from "../../components/dataTable/dataTable.component";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link } from "react-router-dom";
import "./pais.styles.scss";
import moment from "moment";
import { toast } from "react-toastify";

function Pais() {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const msgSuccess = (msj) => toast.success(msj);
  const columns = [
    { tittle: "Nomenclatura" },
    { tittle: "Pais" },
    { tittle: "Nacionalidad" },
    { tittle: "Estado" },
    { tittle: "Fecha Creación" },
    { tittle: "Tiempo Relativo" },
  ];

  const [nomesclatura, setNomesclatura] = useState("");
  const [pais, setPais] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [estado, setEstado] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const urlPais = `${process.env.REACT_APP_BACK_END}/api/pais`;
  const urlPaisCrear = `${process.env.REACT_APP_BACK_END}/api/pais/crear`;

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

  const onChange = (e, setter) => {
    setter(e.target.value);
  };

  const onClickGuardar = (e) => {
    e.preventDefault();
    fetch(urlPaisCrear, headerPost)
      .then((response) => response.json())
      .then((data) => {
        UnauthorizedRedirect(data);
        if (data === "success") {
          fetchdata(urlPais, header, setRows);
          msgSuccess("Registro Exitoso.");
        } else {
          msgError(data);
        }
      });
  };

  const UnauthorizedRedirect = (data) => {
    if (data === "No esta autorizado") {
      localStorage.clear();
      window.location.replace("/login");
    }
  };

  const bodyRequest = {
    nomesclatura: nomesclatura,
    pais: pais,
    nacionalidad: nacionalidad,
    estado: estado,
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

  const headerPost = {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token_key}`,
    },
    body: JSON.stringify(bodyRequest),
  };

  useEffect(() => {
    fetchdata(urlPais, header, setRows);
  }, [localStorage.token_key, urlPais]);

  return (
    <MainLayout Tittle="Pais">
      {!isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Paper>
              <form onSubmit={onClickGuardar} className="inputs-container">
                <TextField
                  label="Nomenclatura"
                  variant="outlined"
                  className="inputs"
                  onChange={(e) => onChange(e, setNomesclatura)}
                />
                <TextField
                  label="Pais"
                  variant="outlined"
                  className="inputs"
                  onChange={(e) => onChange(e, setPais)}
                />
                <TextField
                  label="Nacionalidad"
                  variant="outlined"
                  className="inputs"
                  onChange={(e) => onChange(e, setNacionalidad)}
                />
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
                <Button
                  className="inputs"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Crear Nuevo Pais
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <DataTable columns={columns}>
              {rows.map((row, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell align="center">
                      <Link to={`/pais/${row.id_pais}`}>
                        <IconButton aria-label="edit">
                          <EditIcon />
                        </IconButton>
                      </Link>
                    </TableCell>
                    <TableCell align="center">{row.id_pais}</TableCell>
                    <TableCell align="center">{row.nombre_pais}</TableCell>
                    <TableCell align="center">
                      {row.nombre_nacionalidad}
                    </TableCell>
                    <TableCell align="center">
                      {row.estado === 1 ? "Activo" : "Inactivo"}
                    </TableCell>
                    <TableCell align="center">
                      {moment(row.fecha_creacion).format(
                        "D, MMMM YYYY, h:mm a"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {moment(row.fecha_creacion).fromNow()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </DataTable>
          </Grid>
        </Grid>
      )}
    </MainLayout>
  );
}

export default Pais;

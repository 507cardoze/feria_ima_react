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
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from "react-router-dom";
import Select from "@material-ui/core/Select";
import { toast } from "react-toastify";

function Distritos() {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const msgSuccess = (msj) => toast.success(msj);

  const UnauthorizedRedirect = (data) => {
    if (data === "No esta autorizado") {
      localStorage.clear();
      window.location.replace("/login");
    }
  };

  const [id_provincia, setId_provincia] = useState("");
  const [distrito, setDistrito] = useState("");
  const [estado, setEstado] = useState(true);

  const [isLoading, setisLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [provincias, setProvincias] = useState([]);

  const urlDistrito = `${process.env.REACT_APP_BACK_END}/api/distritos`;
  const urlDistritoCrear = `${process.env.REACT_APP_BACK_END}/api/distritos/crear`;
  const urlProvincia = `${process.env.REACT_APP_BACK_END}/api/provincias`;

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

  const columns = [
    { tittle: "Distrito" },
    { tittle: "Provincias" },
    { tittle: "Estado" },
  ];

  const onChange = (e, setter) => {
    setter(e.target.value);
  };

  const bodyRequest = {
    id_provincia: id_provincia,
    nombre_distrito: distrito,
    estado: estado,
  };

  const headerPost = {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token_key}`,
    },
    body: JSON.stringify(bodyRequest),
  };

  const onClickGuardar = (e) => {
    e.preventDefault();
    fetch(urlDistritoCrear, headerPost)
      .then((response) => response.json())
      .then((data) => {
        UnauthorizedRedirect(data);
        if (data === "success") {
          fetchdata(urlProvincia, header, setProvincias);
          fetchdata(urlDistrito, header, setRows);
          msgSuccess("Registro Exitoso.");
        } else {
          msgError(data);
        }
      });
  };

  useEffect(() => {
    fetchdata(urlProvincia, header, setProvincias);
    fetchdata(urlDistrito, header, setRows);
  }, [localStorage.token_key]);

  console.log(rows);
  console.log(provincias);
  return (
    <MainLayout Tittle="Distritos">
      {!isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Paper>
              <form onSubmit={onClickGuardar} className="inputs-container">
                <TextField
                  label="Distrito"
                  variant="outlined"
                  value={distrito}
                  className="inputs"
                  onChange={(e) => onChange(e, setDistrito)}
                />
                <div className="select-form">
                  <InputLabel id="demo-simple-select-label">
                    Provincias
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    className="inputs"
                    onChange={(e) => onChange(e, setId_provincia)}
                    autoWidth
                    defaultValue={id_provincia}
                  >
                    {provincias.map((pa, i) => {
                      return (
                        <MenuItem value={pa.id_provincia}>
                          {pa.nombre_provincia}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
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
                  Crear Nuevo Distrito
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
                      <Link to={`/distritos/${row.id_distrito}`}>
                        <IconButton aria-label="edit">
                          <EditIcon />
                        </IconButton>
                      </Link>
                    </TableCell>
                    <TableCell align="center">{row.nombre_distrito}</TableCell>
                    <TableCell align="center">{row.nombre_provincia}</TableCell>
                    <TableCell align="center">
                      {row.estado === 1 ? "Activo" : "Inactivo"}
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

export default Distritos;

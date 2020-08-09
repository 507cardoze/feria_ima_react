import React, { useState, useEffect, memo } from "react";
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

function Corregimientos() {
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

  const [id_provincia, setIdProvincia] = useState("");
  const [id_distrito, setIdDistrito] = useState("");
  const [nombre_corregimiento, setNombreCorregimiento] = useState("");

  const [estado, setEstado] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const urlCorregimientos = `${process.env.REACT_APP_BACK_END}/api/corregimientos/filtrada?page=${page}&limit=${limit}`;
  const urlProvincia = `${process.env.REACT_APP_BACK_END}/api/provincias`;
  const urlDistrito = `${process.env.REACT_APP_BACK_END}/api/distritos`;
  const urlCorregimientoCrear = `${process.env.REACT_APP_BACK_END}/api/corregimientos/crear`;

  const { results } = rows;

  const header = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token_key}`,
    },
    mode: "cors",
    cache: "default",
  };

  const bodyRequest = {
    id_provincia: id_provincia,
    id_distrito: id_distrito,
    nombre_corregimiento: nombre_corregimiento,
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
    { tittle: "Corregimientos" },
    { tittle: "Distritos" },
    { tittle: "Provincias" },
    { tittle: "Estado" },
  ];

  const onChange = (e, setter) => {
    setter(e.target.value);
  };

  const onClickGuardar = (e) => {
    e.preventDefault();
    fetch(urlCorregimientoCrear, headerPost)
      .then((response) => response.json())
      .then((data) => {
        UnauthorizedRedirect(data);
        if (data === "success") {
          fetchdata(urlCorregimientos, header, setRows);
          fetchdata(urlProvincia, header, setProvincias);
          fetchdata(urlDistrito, header, setDistritos);
          msgSuccess("Registro Exitoso.");
        } else {
          msgError(data);
        }
      });
  };

  useEffect(() => {
    fetchdata(urlDistrito, header, setDistritos);
  }, [urlDistrito]);

  useEffect(() => {
    fetchdata(urlProvincia, header, setProvincias);
  }, [urlProvincia]);

  useEffect(() => {
    fetchdata(urlCorregimientos, header, setRows);
  }, [urlCorregimientos]);

  console.log(page);

  return (
    <MainLayout Tittle="Corregimientos">
      {!isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Paper>
              <form onSubmit={onClickGuardar} className="inputs-container">
                <TextField
                  label="Corregimiento"
                  variant="outlined"
                  value={nombre_corregimiento}
                  className="inputs"
                  onChange={(e) => onChange(e, setNombreCorregimiento)}
                />
                <div className="select-form">
                  <InputLabel id="distrito-select-label">Distrito</InputLabel>
                  <Select
                    labelId="distrito-select-label"
                    id="distrito-simple-select"
                    className="inputs"
                    onChange={(e) => onChange(e, setIdDistrito)}
                    autoWidth
                    defaultValue={id_distrito}
                  >
                    {distritos.map((pa) => {
                      return (
                        <MenuItem key={pa.id_distrito} value={pa.id_distrito}>
                          {pa.nombre_distrito}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
                <div className="select-form">
                  <InputLabel id="provincias-select-label">
                    Provincias
                  </InputLabel>
                  <Select
                    labelId="provincias-select-label"
                    id="provincias-simple-select"
                    className="inputs"
                    onChange={(e) => onChange(e, setIdProvincia)}
                    autoWidth
                    defaultValue={id_provincia}
                  >
                    {provincias.map((pa) => {
                      return (
                        <MenuItem key={pa.id_provincia} value={pa.id_provincia}>
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
                  Crear Nuevo Corregimiento
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <DataTable columns={columns}>
              {results &&
                results.map((row) => {
                  return (
                    <TableRow key={row.id_corregimiento}>
                      <TableCell component="th" scope="row">
                        <Link to={`/corregimientos/${row.id_corregimiento}`}>
                          <IconButton aria-label="edit">
                            <EditIcon />
                          </IconButton>
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        {row.nombre_corregimiento}
                      </TableCell>
                      <TableCell align="center">
                        {row.nombre_distrito}
                      </TableCell>
                      <TableCell align="center">
                        {row.nombre_provincia}
                      </TableCell>
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

export default memo(Corregimientos);

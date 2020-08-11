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
import TablePagination from "@material-ui/core/TablePagination";
import "./feria.styles.scss";
import SearchBox from "../../components/searchBox/searchBox.compoent";

function Feria() {
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

  //inputs
  const [id_provincia, setIdProvincia] = useState("");
  const [id_distrito, setIdDistrito] = useState("");
  const [id_corregimiento, setIdCorregimiento] = useState("");
  const [nombre_feria, setNombreFeria] = useState("");
  const [descripcion_lugar, setDescripcionLugar] = useState("");
  const [descripcion_feria, setDescripcionFeria] = useState("");
  const [estado, setEstado] = useState(true);
  //loading
  const [isLoading, setisLoading] = useState(true);
  //table data
  const [rows, setRows] = useState({});
  //selects data
  const [corregimientos, setCorregimientos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  //pag files
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const [searchResults, setSearchResults] = useState([]);

  const urlCorregimientos = `${process.env.REACT_APP_BACK_END}/api/corregimientos/filtrada`;
  const urlProvincia = `${process.env.REACT_APP_BACK_END}/api/provincias`;
  const urlDistrito = `${process.env.REACT_APP_BACK_END}/api/distritos`;

  const urlFeria = `${process.env.REACT_APP_BACK_END}/api/feria/filtrada?page=${page}&limit=${limit}`;
  const urlCrear = `${process.env.REACT_APP_BACK_END}/api/feria/crear`;
  const urlBusqueda = `${process.env.REACT_APP_BACK_END}/api/feria/searchField/`;

  const { results } = rows;
  const { total } = rows;

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
    nombre_feria: nombre_feria,
    id_provincia: id_provincia,
    id_distrito: id_distrito,
    id_corregimiento: id_corregimiento,
    descripcion_lugar: descripcion_lugar,
    descripcion_feria: descripcion_feria,
    estado: estado,
    user: "ADMIN",
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
    { tittle: "Feria" },
    { tittle: "Lugar" },
    { tittle: "Descripcion" },
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
    fetch(urlCrear, headerPost)
      .then((response) => response.json())
      .then((data) => {
        UnauthorizedRedirect(data);
        if (data === "success") {
          fetchdata(urlFeria, header, setRows);
          fetchdata(urlCorregimientos, header, setCorregimientos);
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
    fetchdata(urlCorregimientos, header, setCorregimientos);
  }, [urlCorregimientos]);

  useEffect(() => {
    fetchdata(urlFeria, header, setRows);
  }, [urlFeria]);

  useEffect(() => {
    fetchdata(urlFeria, header, setRows);
  }, [page, limit]);

  const handleChangePage = (page) => {
    setPage(page + 1);
  };

  const handleChangeLimit = (limit) => {
    setLimit(limit);
  };

  const handleOnChangeSearchField = async (e) => {
    if (e.target.value.length > 3) {
      const data = await fetch(`${urlBusqueda}${e.target.value}`, header);
      const received_data = await data.json();

      try {
        setSearchResults(received_data);
      } catch (error) {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <MainLayout Tittle="Feria">
      {!isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <SearchBox onChangeInput={handleOnChangeSearchField}>
              {searchResults.length > 0 && (
                <ul className="list">
                  {searchResults.map((value) => {
                    return (
                      <Link
                        className="list-item"
                        key={value.id_feria}
                        to={`/feria/${value.id_feria}`}
                      >{`${value.nombre_feria} - ${value.nombre_corregimiento} - ${value.nombre_distrito} - ${value.nombre_provincia}`}</Link>
                    );
                  })}
                </ul>
              )}
            </SearchBox>
            <Paper>
              <form onSubmit={onClickGuardar} className="inputs-container">
                <TextField
                  label="Feria"
                  variant="outlined"
                  value={nombre_feria}
                  className="inputs"
                  onChange={(e) => onChange(e, setNombreFeria)}
                />
                <TextField
                  label="Lugar"
                  variant="outlined"
                  value={descripcion_lugar}
                  multiline
                  className="inputs"
                  onChange={(e) => onChange(e, setDescripcionLugar)}
                />
                <TextField
                  label="Descripcion"
                  variant="outlined"
                  value={descripcion_feria}
                  multiline
                  className="inputs"
                  onChange={(e) => onChange(e, setDescripcionFeria)}
                />
                <div className="select-form">
                  <InputLabel id="corregimiento-select-label">
                    Corregimiento
                  </InputLabel>
                  <Select
                    labelId="corregimiento-select-label"
                    id="corregimiento-simple-select"
                    className="inputs"
                    onChange={(e) => onChange(e, setIdCorregimiento)}
                    autoWidth
                    defaultValue={id_corregimiento}
                  >
                    {corregimientos.map((pa) => {
                      return (
                        <MenuItem
                          key={pa.id_corregimiento}
                          value={pa.id_corregimiento}
                        >
                          {pa.nombre_corregimiento}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
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
                      className={`inputs`}
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
                  Crear Nueva Feria
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            {results && (
              <>
                <TablePagination
                  rowsPerPageOptions={[25, 50, 100, 200]}
                  labelRowsPerPage="Filas por página"
                  component="div"
                  count={total && total}
                  rowsPerPage={limit}
                  onChangeRowsPerPage={(event) =>
                    handleChangeLimit(parseInt(event.target.value))
                  }
                  page={page - 1}
                  onChangePage={(event, page) => handleChangePage(page)}
                />
                <DataTable columns={columns}>
                  {results.map((row) => {
                    return (
                      <TableRow key={row.id_feria}>
                        <TableCell component="th" scope="row">
                          <Link to={`/feria/${row.id_feria}`}>
                            <IconButton aria-label="edit">
                              <EditIcon />
                            </IconButton>
                          </Link>
                        </TableCell>
                        <TableCell align="center">{row.nombre_feria}</TableCell>
                        <TableCell align="center">
                          {row.descripcion_lugar}
                        </TableCell>
                        <TableCell align="center">
                          {row.descripcion_feria}
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
                        <TableCell
                          align="center"
                          className={`${row.estado === 1 ? "green" : "red"}`}
                        >
                          <span
                            className={`${row.estado === 1 ? "green" : "red"}`}
                          >
                            {row.estado === 1 ? "Activo" : "Inactivo"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </DataTable>
                <TablePagination
                  rowsPerPageOptions={[25, 50, 100, 200]}
                  labelRowsPerPage="Filas por página"
                  component="div"
                  count={total && total}
                  rowsPerPage={limit}
                  onChangeRowsPerPage={(event) =>
                    handleChangeLimit(parseInt(event.target.value))
                  }
                  page={page - 1}
                  onChangePage={(event, page) => handleChangePage(page)}
                />
              </>
            )}
          </Grid>
        </Grid>
      )}
    </MainLayout>
  );
}

export default memo(Feria);

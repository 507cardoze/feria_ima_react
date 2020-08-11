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
import SearchBox from "../../components/searchBox/searchBox.compoent";
import TablePagination from "@material-ui/core/TablePagination";

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

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const [searchResults, setSearchResults] = useState([]);

  const urlDistrito = `${process.env.REACT_APP_BACK_END}/api/distritos/filtrada?page=${page}&limit=${limit}`;
  const urlDistritoCrear = `${process.env.REACT_APP_BACK_END}/api/distritos/crear`;

  const urlProvincia = `${process.env.REACT_APP_BACK_END}/api/provincias/filtrada`;
  const urlBusqueda = `${process.env.REACT_APP_BACK_END}/api/distritos/searchField/`;

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
  }, []);

  useEffect(() => {
    fetchdata(urlDistrito, header, setRows);
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
    <MainLayout Tittle="Distritos">
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
                        key={value.id_distrito}
                        to={`/distritos/${value.id_distrito}`}
                      >{`${value.nombre_distrito}`}</Link>
                    );
                  })}
                </ul>
              )}
            </SearchBox>
            <Paper>
              <form onSubmit={onClickGuardar} className="inputs-container">
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
                    {provincias.map((pa) => {
                      return (
                        <MenuItem key={pa.id_provincia} value={pa.id_provincia}>
                          {pa.nombre_provincia}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
                <TextField
                  label="Distrito"
                  variant="outlined"
                  value={distrito}
                  className="inputs"
                  onChange={(e) => onChange(e, setDistrito)}
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
                  Crear Nuevo Distrito
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
                      <TableRow key={row.id_distrito}>
                        <TableCell align="center">
                          <Link to={`/distritos/${row.id_distrito}`}>
                            <IconButton aria-label="edit">
                              <EditIcon />
                            </IconButton>
                          </Link>
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

export default memo(Distritos);

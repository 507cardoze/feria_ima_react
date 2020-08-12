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
import "./provincias.styles.scss";
import Select from "@material-ui/core/Select";
import { toast } from "react-toastify";
import SearchBox from "../../components/searchBox/searchBox.compoent";
import TablePagination from "@material-ui/core/TablePagination";

function Provincias() {
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

  const [provincia, setProvincia] = useState("");
  const [id_pais, setId_pais] = useState("");

  const [estado, setEstado] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [pais, setPais] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const [searchResults, setSearchResults] = useState([]);

  const urlPais = `${process.env.REACT_APP_BACK_END}/api/pais/filtrada`;
  const urlProvincia = `${process.env.REACT_APP_BACK_END}/api/provincias/filtrada?page=${page}&limit=${limit}`;
  const urlProvinciaCrear = `${process.env.REACT_APP_BACK_END}/api/provincias/crear`;
  const urlBusqueda = `${process.env.REACT_APP_BACK_END}/api/provincias/searchField/`;

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
    { tittle: "Provincias" },
    { tittle: "Pais" },
    { tittle: "Estado" },
  ];

  const onChange = (e, setter) => {
    setter(e.target.value);
  };

  const bodyRequest = {
    id_pais: id_pais,
    nombre_provincia: provincia,
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
    fetch(urlProvinciaCrear, headerPost)
      .then((response) => response.json())
      .then((data) => {
        UnauthorizedRedirect(data);
        if (data === "success") {
          fetchdata(urlPais, header, setPais);
          fetchdata(urlProvincia, header, setRows);
          msgSuccess("Registro Exitoso.");
        } else {
          msgError(data);
        }
      });
  };

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
    fetchdata(urlPais, header, setPais);
    fetchdata(urlProvincia, header, setRows);
  }, [urlPais, urlProvincia]);

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
    fetchdata(urlProvincia, header, setRows);
  }, [page, limit, urlProvincia]);

  return (
    <MainLayout Tittle="Provincias">
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
                        key={value.id_provincia}
                        to={`/provincias/${value.id_provincia}`}
                      >{`${value.id_pais} - ${value.nombre_provincia}`}</Link>
                    );
                  })}
                </ul>
              )}
            </SearchBox>
            <Paper>
              <form onSubmit={onClickGuardar} className="inputs-container">
                <div className="select-form">
                  <InputLabel id="demo-simple-select-label">Pais</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    className="inputs"
                    onChange={(e) => onChange(e, setId_pais)}
                    autoWidth
                    defaultValue={id_pais}
                  >
                    {pais.map((pa) => {
                      return (
                        <MenuItem key={pa.id_pais} value={pa.id_pais}>
                          {pa.nombre_pais}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
                <TextField
                  label="Provincia"
                  variant="outlined"
                  value={provincia}
                  className="inputs"
                  onChange={(e) => onChange(e, setProvincia)}
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
                  Crear Nueva Provincia
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
                      <TableRow key={row.id_provincia}>
                        <TableCell align="center">
                          <Link to={`/provincias/${row.id_provincia}`}>
                            <IconButton aria-label="edit">
                              <EditIcon />
                            </IconButton>
                          </Link>
                        </TableCell>

                        <TableCell align="center">
                          {row.nombre_provincia}
                        </TableCell>
                        <TableCell align="center">{row.id_pais}</TableCell>
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

export default memo(Provincias);

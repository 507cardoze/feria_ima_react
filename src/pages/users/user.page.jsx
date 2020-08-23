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
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TablePagination from "@material-ui/core/TablePagination";
import SearchBox from "../../components/searchBox/searchBox.compoent";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

function Usuarios() {
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

  const [login, setLogin] = useState("");
  const [pswd, setPswd] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState(true);
  const [web, setWeb] = useState(true);
  const [terminal, setTerminal] = useState(true);

  const [rows, setRows] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const { results } = rows;
  const { total } = rows;

  const url = `${process.env.REACT_APP_BACK_END}/api/auth/filtrada?page=${page}&limit=${limit}`;
  const urlBusqueda = `${process.env.REACT_APP_BACK_END}/api/auth/searchField/`;
  const urlCrear = `${process.env.REACT_APP_BACK_END}/api/auth/register`;

  const bodyRequest = {
    login: login,
    pswd: pswd,
    name: name,
    email: email,
    active: estado,
    web: web,
    terminal: terminal,
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
    { tittle: "Usuario" },
    { tittle: "Nombre" },
    { tittle: "Correo" },
    { tittle: "Estado" },
    { tittle: "Permiso Web" },
    { tittle: "Permiso Terminal" },
  ];

  const onChangeSetter = (e, setter) => {
    setter(e.target.value);
  };

  const onClickGuardar = (e) => {
    e.preventDefault();
    fetch(urlCrear, headerPost)
      .then((response) => response.json())
      .then((data) => {
        UnauthorizedRedirect(data);
        if (data === "success") {
          fetchdata(url, header, setRows);
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
        msgError(`No hay conexion... ${error}`);
      }
    };
    fetchdata(url, header, setRows);
  }, [url]);

  const [user, setUser] = useState([]);

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

    const fetchdata = async (url, header, setter) => {
      try {
        const data = await fetch(url, header);
        const filtered = await data.json();
        UnauthorizedRedirect(filtered);
        setter(filtered);
      } catch (error) {
        localStorage.clear();
        window.location.replace("/login");
      }
    };
    fetchdata(urlValidated, header, setUser);
  }, []);

  return (
    <MainLayout Tittle="Usuarios">
      <Grid item xs={12} md={12} lg={12}>
        {user && user.web === 1 && (
          <SearchBox onChangeInput={handleOnChangeSearchField}>
            {searchResults.length > 0 && (
              <ul className="list">
                {searchResults.map((value) => {
                  return (
                    <Link
                      className="list-item"
                      key={value.login}
                      to={`/usuarios/${value.login}`}
                    >{`${value.login} - ${value.name} - ${value.email}`}</Link>
                  );
                })}
              </ul>
            )}
          </SearchBox>
        )}
        {user && user.web === 1 && (
          <Paper>
            <form onSubmit={onClickGuardar} className="inputs-container">
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  label="Usuario"
                  variant="outlined"
                  value={login}
                  className="inputs"
                  type="text"
                  onChange={(e) => onChangeSetter(e, setLogin)}
                />

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
                <TextField
                  label="Contraseña"
                  variant="outlined"
                  value={pswd}
                  className="inputs"
                  type="text"
                  onChange={(e) => onChangeSetter(e, setPswd)}
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
                <Button
                  className="inputs"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Crear Nuevo usuario
                </Button>
              </Grid>
            </form>
          </Paper>
        )}
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        {!isLoading ? (
          <CircularProgress />
        ) : (
          results && (
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
                    <TableRow key={row.id_productos}>
                      <TableCell component="th" scope="row">
                        {user && user.web === 1 && (
                          <>
                            <Link to={`/usuarios/${row.login}`}>
                              <IconButton aria-label="edit">
                                <EditIcon />
                              </IconButton>
                            </Link>
                            <Link to={`/password/${row.login}`}>
                              <IconButton aria-label="edit">
                                <VpnKeyIcon />
                              </IconButton>
                            </Link>
                          </>
                        )}
                      </TableCell>
                      <TableCell align="center">{row.login}</TableCell>
                      <TableCell align="center">{row.name}</TableCell>

                      <TableCell align="center">{row.email}</TableCell>
                      <TableCell align="center">
                        <span
                          className={`${row.active === "Y" ? "green" : "red"}`}
                        >
                          {row.active === "Y" ? "Activo" : "Inactivo"}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        {" "}
                        {row.web === 1 ? "Administrador" : "Usuario"}
                      </TableCell>
                      <TableCell align="center">
                        <span
                          className={`${row.terminal === 1 ? "green" : "red"}`}
                        >
                          {row.terminal === 1 ? "Activo" : "Inactivo"}
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
          )
        )}
      </Grid>
    </MainLayout>
  );
}

export default memo(Usuarios);

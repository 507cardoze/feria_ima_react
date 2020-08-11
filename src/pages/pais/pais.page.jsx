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
import SearchBox from "../../components/searchBox/searchBox.compoent";
import TablePagination from "@material-ui/core/TablePagination";

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

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const [searchResults, setSearchResults] = useState([]);

  const urlPais = `${process.env.REACT_APP_BACK_END}/api/pais/filtrada?page=${page}&limit=${limit}`;
  const urlPaisCrear = `${process.env.REACT_APP_BACK_END}/api/pais/crear`;
  const urlBusqueda = `${process.env.REACT_APP_BACK_END}/api/pais/searchField/`;

  const { results } = rows;
  const { total } = rows;

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
  }, []);

  useEffect(() => {
    fetchdata(urlPais, header, setRows);
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
    <MainLayout Tittle="Pais">
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
                        key={value.id_pais}
                        to={`/pais/${value.id_pais}`}
                      >{`${value.id_pais} - ${value.nombre_pais} - ${value.nombre_nacionalidad}`}</Link>
                    );
                  })}
                </ul>
              )}
            </SearchBox>
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
                      <TableRow key={row.id_pais}>
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

export default Pais;

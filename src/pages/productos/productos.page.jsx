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
import moment from "moment";

function Productos() {
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

  const [nombre_productos, setNombreProductos] = useState("");
  const [frecuencia_compra_dias, setFrecuenciaCompra] = useState(0);
  const [estado, setEstado] = useState(true);

  const [rows, setRows] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const { results } = rows;
  const { total } = rows;

  const url = `${process.env.REACT_APP_BACK_END}/api/productos/filtrada?page=${page}&limit=${limit}`;
  const urlBusqueda = `${process.env.REACT_APP_BACK_END}/api/productos/searchField/`;
  const urlCrear = `${process.env.REACT_APP_BACK_END}/api/productos/crear`;

  const bodyRequest = {
    nombre_productos: nombre_productos,
    frecuencia_compra_dias: frecuencia_compra_dias,
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
    { tittle: "Producto" },
    { tittle: "Frecuencia de compra" },
    { tittle: "Usuario Creacion" },
    { tittle: "Fecha Creacion" },
    { tittle: "Tiempo relativo" },
    { tittle: "Estado" },
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

  return (
    <MainLayout Tittle="Productos">
      <Grid item xs={12} md={12} lg={12}>
        <SearchBox onChangeInput={handleOnChangeSearchField}>
          {searchResults.length > 0 && (
            <ul className="list">
              {searchResults.map((value) => {
                return (
                  <Link
                    className="list-item"
                    key={value.id_productos}
                    to={`/productos/${value.id_productos}`}
                  >{`${value.nombre_productos} - ${value.frecuencia_compra_dias} Días`}</Link>
                );
              })}
            </ul>
          )}
        </SearchBox>
        <Paper>
          <form onSubmit={onClickGuardar} className="inputs-container">
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="Nombre del producto"
                variant="outlined"
                value={nombre_productos}
                className="inputs"
                type="text"
                onChange={(e) => onChangeSetter(e, setNombreProductos)}
              />
              <TextField
                label="Frecuencia de compra"
                variant="outlined"
                value={frecuencia_compra_dias}
                className="inputs"
                type="number"
                onChange={(e) => {
                  if (parseInt(e.target.value) >= 0) {
                    onChangeSetter(e, setFrecuenciaCompra);
                  }
                }}
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
              <Button
                className="inputs"
                variant="contained"
                color="primary"
                type="submit"
              >
                Crear Nuevo Producto
              </Button>
            </Grid>
          </form>
        </Paper>
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
                        <Link to={`/productos/${row.id_productos}`}>
                          <IconButton aria-label="edit">
                            <EditIcon />
                          </IconButton>
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        {row.nombre_productos}
                      </TableCell>
                      <TableCell align="center">
                        {`${row.frecuencia_compra_dias} Días`}
                      </TableCell>

                      <TableCell align="center">
                        {row.usuario_creacion}
                      </TableCell>
                      <TableCell align="center">
                        {moment(row.fecha_creacion).format("D, MMMM YYYY")}
                      </TableCell>
                      <TableCell align="center">
                        {moment(row.fecha_creacion).fromNow()}
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
          )
        )}
      </Grid>
    </MainLayout>
  );
}

export default memo(Productos);

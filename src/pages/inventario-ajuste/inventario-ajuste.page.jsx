import React, { useState, useEffect, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import DataTable from "../../components/dataTable/dataTable.component";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
//import IconButton from "@material-ui/core/IconButton";
//import EditIcon from "@material-ui/icons/Edit";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TablePagination from "@material-ui/core/TablePagination";
import SearchBox from "../../components/searchBox/searchBox.compoent";
import moment from "moment";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

function InventarioAjuste() {
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

  const [id_inventario, setIdInvenario] = useState("");
  const [id_feria, setIdFeria] = useState("");
  const [id_tipo_ajuste, setIdTipoAjuste] = useState("");
  const [cantidad_ajuste, setCantidadAjuste] = useState(0);
  const [observacion, setObservacion] = useState("");

  const [total_disponible_real, setTotalDisponibleReal] = useState(0);

  const [rows, setRows] = useState({});
  const [inventarios, setInventarios] = useState([]);
  const [tipo_ajuste, setTipoAjuste] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const { results } = rows;
  const { total } = rows;

  const url = `${process.env.REACT_APP_BACK_END}/api/inventarios-ajuste/filtrada?page=${page}&limit=${limit}`;
  const urlCrear = `${process.env.REACT_APP_BACK_END}/api/inventarios-ajuste/crear`;
  const urlBusqueda = `${process.env.REACT_APP_BACK_END}/api/inventarios-ajuste/searchField/`;
  const urlBuscar = `${process.env.REACT_APP_BACK_END}/api/inventarios/buscar/`;

  const urlInventario = `${process.env.REACT_APP_BACK_END}/api/inventarios/filtrada`;
  const urlTipoAjuste = `${process.env.REACT_APP_BACK_END}/api/tipo-ajustes/filtrada`;

  const bodyRequest = {
    id_inventario: parseInt(id_inventario),
    id_feria: parseInt(id_feria),
    id_tipo_ajuste: id_tipo_ajuste,
    cantidad_ajuste: parseInt(cantidad_ajuste),
    observacion: observacion,
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
    { tittle: "#" },
    { tittle: "# inventario" },
    { tittle: "Feria" },
    { tittle: "Tipo de ajuste" },
    { tittle: "Cantidad de ajuste" },
    { tittle: "Observacion" },
    { tittle: "Usuario Creacion" },
    { tittle: "Fecha Creacion" },
    { tittle: "Tiempo relativo" },
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
          setIdInvenario("");
          setIdFeria("");
          setIdTipoAjuste("");
          setObservacion("");
          setCantidadAjuste(0);
          setTotalDisponibleReal(0);
          fetchdata(url, header, setRows);
          fetchdata(urlInventario, header, setInventarios);
          fetchdata(urlTipoAjuste, header, setTipoAjuste);
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

  const fetchDataBuscar = async (e) => {
    setIdInvenario(e.target.value);
    try {
      const data = await fetch(`${urlBuscar}${e.target.value}`, header);
      const dat = await data.json();
      UnauthorizedRedirect(dat);
      dat.forEach((dt) => {
        setIdFeria(dt.id_feria);
        setTotalDisponibleReal(dt.disponible_real);
      });
    } catch (error) {
      msgError(error);
    }
  };

  const salidaOEntrada = (tipo, cantidad) => {
    console.log(cantidad);
    if (cantidad >= 0) {
      if (tipo === "SA") {
        if (cantidad_ajuste < total_disponible_real) {
          setCantidadAjuste(cantidad);
        } else if (cantidad < total_disponible_real) {
          setCantidadAjuste(cantidad);
        }
      } else {
        setCantidadAjuste(cantidad);
      }
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
    fetchdata(url, header, setRows);
    fetchdata(urlInventario, header, setInventarios);
    fetchdata(urlTipoAjuste, header, setTipoAjuste);
  }, [url, urlInventario, urlTipoAjuste]);

  return (
    <MainLayout Tittle="Inventario Ajuste">
      <Grid item xs={12} md={12} lg={12}>
        <div className="header-buttons">
          <Button variant="contained" color="primary" className="button-input">
            <Link to="/inventario">Atras</Link>
          </Button>
        </div>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <SearchBox onChangeInput={handleOnChangeSearchField}>
          {searchResults.length > 0 && (
            <ul className="list">
              {searchResults.map((value) => {
                return (
                  <Link
                    className="list-item"
                    key={value.id}
                    to={`/inventario-ajuste/${value.id}`}
                  >{`#${value.id} - # inventario ${value.id_inventario} - ${value.observacion} - ${value.nombre_feria}`}</Link>
                );
              })}
            </ul>
          )}
        </SearchBox>
        <Paper>
          <form onSubmit={onClickGuardar} className="inputs-container">
            <Grid item xs={12} md={6} lg={6}>
              <div className="select-form">
                <InputLabel id="inventarios-select-label">
                  Inventarios
                </InputLabel>
                <Select
                  labelId="inventario-select-label"
                  id="inventario-simple-select"
                  className="inputs"
                  onChange={fetchDataBuscar}
                  autoWidth
                  value={id_inventario}
                >
                  {inventarios.map((pa) => {
                    return (
                      <MenuItem key={pa.id_inventario} value={pa.id_inventario}>
                        {`#${pa.id_inventario} - ${pa.nombre_feria} - ${pa.nombre_productos}`}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              {id_feria && (
                <div className="select-form">
                  <InputLabel id="tipo-ajuste-select-label">
                    Tipo de Ajustes
                  </InputLabel>
                  <Select
                    labelId="tipo-ajuste-select-label"
                    id="tipo-ajuste-simple-select"
                    className="inputs"
                    onChange={(e) => {
                      onChangeSetter(e, setIdTipoAjuste);
                      setCantidadAjuste(0);
                    }}
                    autoWidth
                    defaultValue={id_tipo_ajuste}
                  >
                    {tipo_ajuste.map((pa) => {
                      return (
                        <MenuItem
                          key={pa.id_tipo_ajuste}
                          value={pa.id_tipo_ajuste}
                        >
                          {pa.id_tipo_ajuste}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="Disponible Real"
                variant="outlined"
                value={total_disponible_real}
                className="inputs"
                type="number"
                disabled
              />
              {id_tipo_ajuste && (
                <>
                  <TextField
                    label="Cantidad de ajuste"
                    variant="outlined"
                    value={cantidad_ajuste}
                    className="inputs"
                    type="number"
                    onChange={(e) =>
                      salidaOEntrada(id_tipo_ajuste, parseInt(e.target.value))
                    }
                  />
                  <TextField
                    label="Observación"
                    variant="outlined"
                    defaultValue={observacion}
                    className="inputs"
                    type="text"
                    rows={3}
                    multiline
                    onChange={(e) => onChangeSetter(e, setObservacion)}
                  />
                  <Button
                    className="inputs"
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    {`Crear Nuevo Ajuste ${
                      id_tipo_ajuste === "EN" ? "Entrada" : ""
                    } ${id_tipo_ajuste === "SA" ? "Salida" : ""}`}
                  </Button>
                </>
              )}
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
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {/* <Link to={`/inventario-ajuste/${row.id}`}>
                          <IconButton aria-label="edit">
                            <EditIcon />
                          </IconButton>
                        </Link> */}
                      </TableCell>
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell align="center">{row.id_inventario}</TableCell>
                      <TableCell align="center">
                        {`${row.nombre_feria}`}
                      </TableCell>
                      <TableCell align="center">
                        {`${row.id_tipo_ajuste}`}
                      </TableCell>
                      <TableCell align="center">
                        {`${row.cantidad_ajuste}`}
                      </TableCell>
                      <TableCell align="center">
                        {`${row.observacion}`}
                      </TableCell>
                      <TableCell align="center">
                        {`${row.usuario_ajuste}`}
                      </TableCell>
                      <TableCell align="center">
                        {`${moment(row.fecha_ajuste).format("D, MMMM YYYY")}`}
                      </TableCell>
                      <TableCell align="center">
                        {`${moment(row.fecha_ajuste).fromNow()}`}
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

export default memo(InventarioAjuste);
